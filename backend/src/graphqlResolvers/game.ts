import * as jsonpatch from 'fast-json-patch';

import { ApolloError, ForbiddenError, PubSub, UserInputError } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSubAsyncIterator } from 'graphql-redis-subscriptions/dist/pubsub-async-iterator';

import { withTransform } from '~playfulbot/withTransform';

import { actions } from '~playfulbot/games/tictactoe';

import {
  UnknownAction,
  GameScheduleNotFoundError,
  GameNotFoundError,
  PlayingOutOfTurn,
} from '~playfulbot/errors';

import { ApolloContext, isBotContext, isUserContext } from '~playfulbot/types/apolloTypes';

import { GameState } from '~playfulbot/types/gameState';

import {
  GameID,
  GamePatchSubscriptionData,
  GameSchedule,
  GameScheduleID,
  PlayerID,
} from '~playfulbot/types/backend';

import {
  getGame,
  getDebugGame,
  createNewDebugGame,
  getGameSchedule,
} from '~playfulbot/Model/Games';
import { GameResult } from '~playfulbot/types/graphql';
import { mergeListAndIterator } from '~playfulbot/utils/asyncIterators';

// const pubsub = new PubSub();

const pubsub = new RedisPubSub();

const GAME_STATE_CHANGED = (id: GameID) => `GAME_STATE_CHANGED-${id}`;
const GAME_SCHEDULE_CHANGED = (id: GameScheduleID) => `GAME_SCHEDULE_CHANGED-${id}`;

interface gameQueryArguments {
  gameID: GameID;
}

export function gameResolver(
  parent: unknown,
  args: gameQueryArguments,
  ctx: ApolloContext
): GameResult<GameState> {
  if (!args.gameID) {
    throw new UserInputError('No game ID provided');
  }
  const game = getGame(args.gameID);
  if (!game) {
    throw new GameNotFoundError();
  }
  return game;
}

interface debugGameQueryArguments {
  userID: string;
}

export async function debugGameResolver(
  parent: unknown,
  args: debugGameQueryArguments,
  ctx: ApolloContext
): Promise<GameSchedule<GameState>> {
  let debugGame = getDebugGame(args.userID);
  if (!debugGame) {
    await createNewDebugGame(args.userID);
    debugGame = getDebugGame(args.userID);
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
): Promise<GameSchedule<GameState>> {
  if (!isUserContext(ctx)) {
    throw new ForbiddenError('Only users are allowed to create games');
  }
  const debugGame = await createNewDebugGame(ctx.userID);
  await pubsub.publish(GAME_SCHEDULE_CHANGED(debugGame.id), { gameScheduleChanges: debugGame });
  return debugGame;
}

interface createNewDebugGameForUserMutationArguments {
  userID: string;
}

export async function createNewDebugGameForUserResolver(
  parent: unknown,
  args: createNewDebugGameForUserMutationArguments,
  ctx: ApolloContext
): Promise<GameSchedule<GameState>> {
  const debugGame = await createNewDebugGame(args.userID);
  await pubsub.publish(GAME_SCHEDULE_CHANGED(debugGame.id), { gameScheduleChanges: debugGame });
  return debugGame;
}

interface GameScheduleQueryArguments {
  scheduleID: string;
}

export async function gameScheduleResolver(
  parent: unknown,
  args: GameScheduleQueryArguments,
  ctx: ApolloContext
): Promise<GameSchedule<GameState>> {
  const gameSchedule = getGameSchedule(args.scheduleID);
  if (!gameSchedule) {
    throw new GameScheduleNotFoundError();
  }
  return Promise.resolve(gameSchedule);
}

interface GameScheduleChangesSubscriptionArguments {
  scheduleID: string;
}

export const gameScheduleChangesResolver = {
  subscribe: (
    model: unknown,
    args: GameScheduleChangesSubscriptionArguments,
    context: ApolloContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<unknown, unknown, undefined> =>
    pubsub.asyncIterator([GAME_SCHEDULE_CHANGED(args.scheduleID)]),
};

interface GamePatchSubscriptionArguments {
  gameID: string;
}

export const gamePatchResolver = {
  subscribe: withTransform<GamePatchSubscriptionData<GameState>>(
    (
      model: unknown,
      args: GamePatchSubscriptionArguments,
      context: ApolloContext,
      info: GraphQLResolveInfo
    ): AsyncIterator<GamePatchSubscriptionData<GameState>, unknown, undefined> => {
      const game = getGame(args.gameID);
      const pubSubIterator = pubsub.asyncIterator([GAME_STATE_CHANGED(args.gameID)]);
      return mergeListAndIterator<GamePatchSubscriptionData<GameState>>(
        [{ gamePatch: game }],
        pubSubIterator as any
      );
      // return pubsub.asyncIterator([GAME_STATE_CHANGED(args.gameID)])
    },
    (payload, variable, context, info) => {
      // console.log(`SENDING PATCH ${payload.gamePatch.version}`);
      return payload; // FIXME: remove any field which should not be visible to the current player
    }
  ),

  // withTransform<GamePatchSubscriptionData>(
  //   (
  //     model: unknown,
  //     args: GamePatchSubscriptionArguments,
  //     context: ApolloContext,
  //     info: GraphQLResolveInfo
  //   ): AsyncIterator<GamePatchSubscriptionData, unknown, undefined> => {
  //     const game = getGame(args.gameID);
  //     if (!game) {
  //       throw new GameNotFoundError();
  //     }
  //     return pubsub.asyncIterator([GAME_STATE_CHANGED(args.gameID)]);
  //   },
  //   function (payload, variable, context, info) {
  //     console.log(`SENDING PATCH ${payload.gamePatch.version}`)
  //     return payload; // FIXME: remove any field which should not be visible to the current player
  //   }
  // ),
};

interface PlayMutationArguments {
  gameID: GameID;
  playerID: PlayerID;
  action: string;
  data: Record<string, unknown>;
}

export async function playResolver(
  parent: unknown,
  args: PlayMutationArguments,
  context: ApolloContext,
  info: GraphQLResolveInfo
): Promise<void> {
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

  const gameAction = actions.get(args.action);

  const { gameState } = game;

  if (!gameAction) {
    throw new UnknownAction(args.action);
  }
  const observer = jsonpatch.observe<GameState>(gameState);

  if (!playerState.playing) {
    // console.log(`Player ${assignment.playerNumber.toString()} Playing out of turn`);
    throw new PlayingOutOfTurn();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gameAction.handler(assignment.playerNumber, gameState, args.data as any);

  const patch = jsonpatch.generate(observer);
  game.version += 1;
  // console.log(`VERSION: ${game.version} END: ${game.gameState.end.toString()}`);

  jsonpatch.unobserve(gameState, observer);

  // console.log(`PUBLISHING PATCH ${game.version}`);
  await pubsub
    .publish(GAME_STATE_CHANGED(game.id), {
      gamePatch: { patch, gameID: game.id, version: game.version },
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}
