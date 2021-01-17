import * as jsonpatch from 'fast-json-patch';

import { actions } from '~playfulbot/games/tictactoe';

import { UnknownAction, GameNotFoundError } from '~playfulbot/Errors';

import { ApolloError, ForbiddenError, PubSub, UserInputError } from 'apollo-server-koa';

import { ApolloContext } from '~playfulbot/types/apolloTypes'

import { GameState } from '~playfulbot/gameState/types'

import { PlayingOutOfTurn } from '~playfulbot/Errors'

import { Game, DebugGame, NoDebugGame, DebugGameResult, User } from '~playfulbot/types/graphql'

import { getGame, getDebugGame, createNewDebugGame } from '~playfulbot/Model/Games'

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';
const DEBUG_GAME_CHANGED = 'DEBUG_GAME_CHANGED';

export function gameResolver(_: any, __: any, ctx: ApolloContext): Game<GameState> {
  if (!ctx.game) {
    throw new UserInputError('No game ID provided');
  }
  const game = getGame(ctx.game);
  if (!game) {
    throw new GameNotFoundError();
  }
  return game;
}


export async function debugGameResolver(_: any, __: any, ctx: ApolloContext): Promise<DebugGameResult> {
  let debugGame = getDebugGame();
  if (!debugGame) {
    await createNewDebugGame()
    debugGame = getDebugGame();
  }
  if (debugGame) {
    return debugGame;
  }
  return new NoDebugGame();
}

export async function createNewDebugGameResolver(_: any, __: any, ctx: ApolloContext): Promise<DebugGame> {
  const debugGame = await createNewDebugGame();
  pubsub.publish(DEBUG_GAME_CHANGED, debugGame);
  return debugGame;
}

export const DebugGameChangesResolver = {
  subscribe: (model: any, args: any, context: ApolloContext, info: any) => {
    return pubsub.asyncIterator([DEBUG_GAME_CHANGED])
  },
}

export const gamePatchResolver = {
  subscribe: (model: any, args: any, context: ApolloContext, info: any) => {
    const game = getGame(args.gameID);
    if (!game) {
      throw new GameNotFoundError();
    }
    return pubsub.asyncIterator([GAME_STATE_CHANGED])
  },
}

export const debugGameChangesResolver = {
  subscribe: (model: any, args: any, context: ApolloContext, info: any) => {
    return pubsub.asyncIterator([DEBUG_GAME_CHANGED])
  },
}

export function playResolver(parent: any, args: any, context: ApolloContext, info: any) {
  console.log("playing " + args.action)
  console.log(JSON.stringify(args.data))

  if (context.game && context.game !== args.gameID) {
    throw new ForbiddenError('Not allowed to play to this game.');
  }
  const game = getGame(args.gameID);

  if (args.player < 0 || args.player >= game.players.length) {
    throw new ApolloError(`Game does not have player ${args.player}.`);
  }
  const player = game.players[args.player];
  const playerState = game.gameState.players[args.player];

  if ((context.playerNumber && context.playerNumber !== args.player) ||
      context.userID === player.user.id) {
    throw new ForbiddenError(`Not allowed to play as player ${args.player}.`);
  }

  const gameAction = actions.get(args.action);

  const gameState: GameState = game.gameState;

  if (!gameAction) {
    throw new UnknownAction(args.action);
  }
  const observer = jsonpatch.observe<object>(gameState);

  if (!playerState.playing) {
    throw new PlayingOutOfTurn();
  }
  gameAction.handler(player.playerNumber, gameState as any, args.data);

  const patch = jsonpatch.generate(observer);
  game.version += 1;

  jsonpatch.unobserve(gameState, observer);
  pubsub.publish(GAME_STATE_CHANGED, {
    gamePatch: { patch, gameID: game.id, version: game.version }
  });
}