import * as jsonpatch from 'fast-json-patch';

import { init, actions } from '~playfulbot/games/tictactoe';

import { UnknownAction } from '~playfulbot/Errors';

import { ForbiddenError, PubSub } from 'apollo-server-koa';

import { ApolloContext } from '~playfulbot/types/apolloTypes'

import { createPlayerToken } from '~playfulbot/graphqlResolvers/authentication'

import { GameState } from '~playfulbot/gameState/types'

import { PlayingOutOfTurn } from '~playfulbot/Errors'


const gameState: GameState = init();

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';

const games: any = {
  debug: {
    id: '42',
    players: [
      {playerNumber: 0, user: '1', token: createPlayerToken('1', 0, '42')},
      {playerNumber: 1, user: '1', token: createPlayerToken('1', 1, '42')}
    ],
    gameState
  }
}

export function gameResolver(_: any, __: any, ctx: ApolloContext)  {
  if (!ctx.game) {
    throw new Error("No game ID");
  }
  return games[ctx.game];
}


export function debugGameResolver(_: any, __: any, ctx: ApolloContext)  {
  return games['debug'];
  // return {
  //   id: gameID,
  //   players: [
  //     {playerNumber: 0, user: ctx.userID, token: createPlayerToken(ctx.userID, 0, gameID)},
  //     {playerNumber: 1, user: ctx.userID, token: createPlayerToken(ctx.userID, 1, gameID)}
  //   ],
  //   gameState
  // };
}

export const gamePatchResolver = {
  subscribe: (model: any, args: any, context: ApolloContext, info: any) => {
    return pubsub.asyncIterator([GAME_STATE_CHANGED])
  },
}


export function playResolver(parent: any, args: any, context: ApolloContext, info: any) {
  console.log("playing " + args.action)
  console.log(JSON.stringify(args.data))
  const gameAction = actions.get(args.action);
  if (!gameAction) {
    throw new UnknownAction(args.action);
  }
  const observer = jsonpatch.observe<object>(gameState);

  if (!('playerNumber' in context)) {
    throw new ForbiddenError("Play request from a non-player.");
  }
  const expectedPlayer = gameState.players.findIndex((player) => player.playing);
  if (context.playerNumber !== expectedPlayer) {
    throw new PlayingOutOfTurn();
    // context.playerNumber = expectedPlayer;
  }
  gameAction.handler(0, gameState as any, args.data);

  const patch = jsonpatch.generate(observer);
  jsonpatch.unobserve(gameState, observer);
  pubsub.publish(GAME_STATE_CHANGED, {
    gamePatch: patch
  });
}