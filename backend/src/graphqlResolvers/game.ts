import * as jsonpatch from 'fast-json-patch';

import { init, actions } from '~team_builder/games/tictactoe';

import { UnknownAction } from '~team_builder/Errors';

import { PubSub } from 'apollo-server-koa';


const gameState = init();

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';


export function gameResolver() {
  return gameState;
}

export const gamePatchResolver = {
  subscribe: () => pubsub.asyncIterator([GAME_STATE_CHANGED]),
}


export function playResolver(parent: any, args: any, context: any, info: any) {
  console.log("playing " + args.action)
  console.log(JSON.stringify(args.data))
  const gameAction = actions.get(args.action);
  if (!gameAction) {
    throw new UnknownAction(args.action);
  }
  const observer = jsonpatch.observe<object>(gameState);
  gameAction.handler(0, gameState, args.data);
  const patch = jsonpatch.generate(observer);
  jsonpatch.unobserve(gameState, observer);
  pubsub.publish(GAME_STATE_CHANGED, {
    gamePatch: patch
  });
}