import * as jsonpatch from 'fast-json-patch';

import { ApolloError, ForbiddenError, PubSub, UserInputError } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';

import { PubSubAsyncIterator } from 'graphql-redis-subscriptions/dist/pubsub-async-iterator';

import { withTransform } from '~playfulbot/withTransform';

// import { actions } from '~playfulbot/games/tictactoe';
import { actions } from '~playfulbot/games/wallrace';

import {
  UnknownAction,
  GameScheduleNotFoundError,
  GameNotFoundError,
  PlayingOutOfTurn,
} from '~playfulbot/errors';

import { ApolloContext, isBotContext, isUserContext } from '~playfulbot/types/apolloTypes';

import { GameState } from '~playfulbot/types/gameState';

import { GameID, GameScheduleID } from '~playfulbot/types/database';

import {
  getGame,
  getDebugGame,
  createNewDebugGame,
  getGameSchedule,
} from '~playfulbot/Model/Games';
import * as gqlTypes from '~playfulbot/types/graphql';
import { mergeListAndIterator } from '~playfulbot/utils/asyncIterators';
import { pubsub } from '~playfulbot/Model/redis';
import { deleteGameStore, getStoredActions, storeAction } from '~playfulbot/Model/ActionStore';
import { Action } from '~playfulbot/types/action';

// const pubsub = new PubSub();

const GAME_STATE_CHANGED = (id: GameID) => `GAME_STATE_CHANGED-${id}`;
const GAME_SCHEDULE_CHANGED = (id: GameScheduleID) => `GAME_SCHEDULE_CHANGED-${id}`;

export const gameResolver: gqlTypes.QueryResolvers<ApolloContext>['game'] = (parent, args, ctx) => {
  if (!args.gameID) {
    throw new UserInputError('No game ID provided');
  }
  const game = getGame(args.gameID);
  if (!game) {
    throw new GameNotFoundError();
  }
  return game;
};

export const debugGameResolver: gqlTypes.QueryResolvers<ApolloContext>['debugGame'] = async (
  parent,
  args,
  ctx
) => {
  let debugGame = getDebugGame(args.userID);
  if (!debugGame) {
    await createNewDebugGame(args.userID);
    debugGame = getDebugGame(args.userID);
  }
  if (debugGame) {
    return debugGame;
  }
  throw new Error('Not implemented');
};

export const createNewDebugGameResolver: gqlTypes.MutationResolvers<ApolloContext>['createNewDebugGame'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new ForbiddenError('Only users are allowed to create games');
  }
  const debugGame = await createNewDebugGame(ctx.userID);
  await pubsub.publish(GAME_SCHEDULE_CHANGED(debugGame.id), { gameScheduleChanges: debugGame });
  return debugGame;
};

export const createNewDebugGameForUserResolver: gqlTypes.MutationResolvers<ApolloContext>['createNewDebugGameForUser'] = async (
  parent,
  args,
  ctx
) => {
  const debugGame = await createNewDebugGame(args.userID);
  await pubsub.publish(GAME_SCHEDULE_CHANGED(debugGame.id), { gameScheduleChanges: debugGame });
  return debugGame;
};

export const gameScheduleResolver: gqlTypes.QueryResolvers<ApolloContext>['gameSchedule'] = async (
  parent,
  args,
  ctx
) => {
  const gameSchedule = getGameSchedule(args.scheduleID);
  if (!gameSchedule) {
    throw new GameScheduleNotFoundError();
  }
  return Promise.resolve(gameSchedule);
};

export const gameScheduleChangesResolver: gqlTypes.SubscriptionResolvers<ApolloContext>['gameScheduleChanges'] = {
  subscribe: (model, args, context, info) =>
    pubsub.asyncIterator([GAME_SCHEDULE_CHANGED(args.scheduleID)]),
};

interface GamePatchSubscriptionArguments {
  gameID: string;
}

export interface GamePatchSubscriptionData<GS extends GameState> {
  gamePatch: gqlTypes.LiveGame<GS>;
}

export const gamePatchResolver: gqlTypes.SubscriptionResolvers<ApolloContext>['gamePatch'] = {
  // There is no built-in way to confirm that a subscription is done via Graphql.
  // See https://github.com/apollographql/subscriptions-transport-ws/issues/451
  // Thus some messages might be missed. This is why we first send the whole game state
  subscribe: (model, args, context, info) => {
    const game = getGame(args.gameID);
    const pubSubIterator = pubsub.asyncIterator([GAME_STATE_CHANGED(args.gameID)]);
    return mergeListAndIterator<GamePatchSubscriptionData<GameState>>(
      [{ gamePatch: { __typename: 'Game', ...game } }],
      pubSubIterator as any
    );
  },
};

export const playResolver: gqlTypes.MutationResolvers<ApolloContext>['play'] = async (
  parent,
  args,
  context,
  info
): Promise<boolean> => {
  const game = getGame(args.gameID);

  const assignment = game.assignments.find((assign) => assign.playerID === args.playerID);
  if (assignment === undefined) {
    throw new ApolloError(`Game does not have player ${args.playerID}.`);
  }

  if (isUserContext(context) && (!assignment.userID || assignment.userID !== context.userID)) {
    throw new ForbiddenError(`User is not allowed to play as player ${args.playerID}.`);
  }

  if (isBotContext(context) && context.playerID !== args.playerID) {
    throw new ForbiddenError(`Bot is not allowed to play as player ${args.playerID}.`);
  }

  const playerState = game.gameState.players[assignment.playerNumber];
  // console.log(`Player ${assignment.playerNumber.toString()} is playing`);

  // const gameAction = actions.schemas(args.action);
  const action = {
    player: assignment.playerNumber,
    name: args.action,
    data: args.data as Record<string, any>,
  };
  const { gameState } = game;

  const expectedActions = game.gameState.players.filter((player) => player.playing).length;
  let actionsToPlay = new Array<Action>();
  if (expectedActions > 1) {
    const nbStoredActions = storeAction(game.id, action);
    if (nbStoredActions < expectedActions) {
      return true;
    }
    actionsToPlay = getStoredActions(game.id);
    deleteGameStore(game.id);
  } else {
    actionsToPlay = [action];
  }

  // if (!gameAction) {
  //   throw new UnknownAction(args.action);
  // }
  const observer = jsonpatch.observe<GameState>(gameState);

  if (!playerState.playing) {
    // console.log(`Player ${assignment.playerNumber.toString()} Playing out of turn`);
    throw new PlayingOutOfTurn();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions.handler(gameState as any, actionsToPlay as any);

  const patch = jsonpatch.generate(observer);
  jsonpatch.unobserve(gameState, observer);

  if (patch.length === 0) {
    return true;
  }
  game.version += 1;
  // console.log(`VERSION: ${game.version} END: ${game.gameState.end.toString()}`);
  // console.log(`PUBLISHING PATCH ${game.version}`);
  await pubsub
    .publish(GAME_STATE_CHANGED(game.id), {
      gamePatch: { patch, gameID: game.id, version: game.version },
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
  return true;
};
