import * as jsonpatch from 'fast-json-patch';

import { init, actions } from '~playfulbot/games/tictactoe';

import { UnknownAction, NotFoundError } from '~playfulbot/Errors';

import { ApolloError, ForbiddenError, PubSub } from 'apollo-server-koa';

import { ApolloContext } from '~playfulbot/types/apolloTypes'

import { createPlayerToken } from '~playfulbot/graphqlResolvers/authentication'

import { GameState } from '~playfulbot/gameState/types'

import { PlayingOutOfTurn } from '~playfulbot/Errors'

import { v4 as uuidv4 } from 'uuid';


const gameState: GameState = init();

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';

function newGame() {
  const id = uuidv4()
  return {
    id: id,
    version: 0,
    players: [
      {playerNumber: 0, user: '1', token: createPlayerToken('1', 0, id)},
      {playerNumber: 1, user: '1', token: createPlayerToken('1', 1, id)}
    ],
    gameState
  }
}

const games: any = {}
let debugGame = newGame();
games[debugGame.id] = debugGame

export function gameResolver(_: any, __: any, ctx: ApolloContext)  {
  if (!ctx.game) {
    throw new Error("No game ID");
  }
  return games[ctx.game];
}


export function debugGameResolver(_: any, __: any, ctx: ApolloContext)  {
  return debugGame;
}

export const gamePatchResolver = {
  subscribe: (model: any, args: any, context: ApolloContext, info: any) => {
    console.log(JSON.stringify(args))
    if (!(args.gameID in games)) {
      throw new NotFoundError('Game not found');
    }
    return pubsub.asyncIterator([GAME_STATE_CHANGED])
  },
}


export function playResolver(parent: any, args: any, context: ApolloContext, info: any) {
  console.log("playing " + args.action)
  console.log(JSON.stringify(args.data))

  if (context.game && context.game !== args.gameID) {
    throw new ForbiddenError('Not allowed to play to this game.');
  }
  const game = games[args.gameID];

  if (args.player < 0 || args.player >= game.players.length) {
    throw new ApolloError(`Game does not have player ${args.player}.`);
  }
  const player = game.players[args.player];

  if ((context.playerNumber && context.playerNumber !== args.player) ||
      context.userID === player.user) {
    throw new ForbiddenError(`Not allowed to play as player ${args.player}.`);
  }

  const gameAction = actions.get(args.action);

  const gameState: GameState = game.gameState;

  if (!gameAction) {
    throw new UnknownAction(args.action);
  }
  const observer = jsonpatch.observe<object>(gameState);

  if (player.playing) {
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