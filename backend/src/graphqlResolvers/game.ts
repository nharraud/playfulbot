import * as jsonpatch from 'fast-json-patch';

import { ApolloError, ForbiddenError, PubSub, UserInputError } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';
import { actions } from '~playfulbot/games/tictactoe';

import { UnknownAction, GameNotFoundError, PlayingOutOfTurn } from '~playfulbot/errors';

import { ApolloContext } from '~playfulbot/types/apolloTypes';

import { GameState } from '~playfulbot/types/gameState';

import { Game, DebugGame } from '~playfulbot/types/graphql';

import { getGame, getDebugGame, createNewDebugGame } from '~playfulbot/Model/Games';

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';
const DEBUG_GAME_CHANGED = 'DEBUG_GAME_CHANGED';

export function gameResolver(parent: unknown, args: unknown, ctx: ApolloContext): Game<GameState> {
  if (!ctx.game) {
    throw new UserInputError('No game ID provided');
  }
  const game = getGame(ctx.game);
  if (!game) {
    throw new GameNotFoundError();
  }
  return game;
}

export async function debugGameResolver(
  parent: unknown,
  args: unknown,
  ctx: ApolloContext
): Promise<DebugGame> {
  let debugGame = getDebugGame();
  if (!debugGame) {
    await createNewDebugGame();
    debugGame = getDebugGame();
  }
  if (debugGame) {
    return debugGame;
  }
  throw new Error('Not implemented');
}

export async function createNewDebugGameResolver(
  parent: unknown,
  args: unknown,
  ctx: ApolloContext
): Promise<DebugGame> {
  const debugGame = await createNewDebugGame();
  await pubsub.publish(DEBUG_GAME_CHANGED, debugGame);
  return debugGame;
}

export const DebugGameChangesResolver = {
  subscribe: (
    model: unknown,
    args: unknown,
    context: ApolloContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<unknown, unknown, undefined> => pubsub.asyncIterator([DEBUG_GAME_CHANGED]),
};

interface GamePatchArguments {
  gameID: string;
}

export const gamePatchResolver = {
  subscribe: (
    model: unknown,
    args: GamePatchArguments,
    context: ApolloContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<unknown, unknown, undefined> => {
    const game = getGame(args.gameID);
    if (!game) {
      throw new GameNotFoundError();
    }
    return pubsub.asyncIterator([GAME_STATE_CHANGED]);
  },
};

export const debugGameChangesResolver = {
  subscribe: (
    model: unknown,
    args: unknown,
    context: ApolloContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<unknown, unknown, undefined> => pubsub.asyncIterator([DEBUG_GAME_CHANGED]),
};

interface PlayArguments {
  gameID: string;
  player: number;
  action: string;
  data: Record<string, unknown>;
}

export async function playResolver(
  parent: unknown,
  args: PlayArguments,
  context: ApolloContext,
  info: GraphQLResolveInfo
): Promise<void> {
  if (context.game && context.game !== args.gameID) {
    throw new ForbiddenError('Not allowed to play to this game.');
  }
  const game = getGame(args.gameID);

  if (args.player < 0 || args.player >= game.players.length) {
    throw new ApolloError(`Game does not have player ${args.player}.`);
  }
  const player = game.players[args.player];
  const playerState = game.gameState.players[args.player];

  if (
    (context.playerNumber && context.playerNumber !== args.player) ||
    context.userID === player.user.id
  ) {
    throw new ForbiddenError(`Not allowed to play as player ${args.player}.`);
  }

  const gameAction = actions.get(args.action);

  const { gameState } = game;

  if (!gameAction) {
    throw new UnknownAction(args.action);
  }
  const observer = jsonpatch.observe<GameState>(gameState);

  if (!playerState.playing) {
    throw new PlayingOutOfTurn();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gameAction.handler(player.playerNumber, gameState, args.data as any);

  const patch = jsonpatch.generate(observer);
  game.version += 1;

  jsonpatch.unobserve(gameState, observer);
  await pubsub.publish(GAME_STATE_CHANGED, {
    gamePatch: { patch, gameID: game.id, version: game.version },
  });
}
