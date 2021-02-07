import * as jsonpatch from 'fast-json-patch';

import { ApolloError, ForbiddenError, PubSub, UserInputError } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';

import { withTransform } from '~playfulbot/withTransform';

import { actions } from '~playfulbot/games/tictactoe';

import {
  UnknownAction,
  GameScheduleNotFoundError,
  GameNotFoundError,
  PlayingOutOfTurn,
} from '~playfulbot/errors';

import { ApolloContext } from '~playfulbot/types/apolloTypes';

import { GameState } from '~playfulbot/types/gameState';

import { Game, GamePatchSubscriptionData, GameSchedule } from '~playfulbot/types/graphql';

import {
  getGame,
  getDebugGame,
  createNewDebugGame,
  getGameSchedule,
} from '~playfulbot/Model/Games';

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';
const GAME_SCHEDULE_CHANGED = (id: string) => `GAME_SCHEDULE_CHANGED-${id}`;

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
): Promise<GameSchedule<GameState>> {
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
): Promise<GameSchedule<GameState>> {
  const debugGame = await createNewDebugGame();
  await pubsub.publish(GAME_SCHEDULE_CHANGED(debugGame.id), { gameScheduleChanges: debugGame });
  return debugGame;
}

interface GameScheduleArguments {
  scheduleID: string;
}

export async function gameScheduleResolver(
  parent: unknown,
  args: GameScheduleArguments,
  ctx: ApolloContext
): Promise<GameSchedule<GameState>> {
  const gameSchedule = getGameSchedule(args.scheduleID);
  if (!gameSchedule) {
    throw new GameScheduleNotFoundError();
  }
  return Promise.resolve(gameSchedule);
}

interface GameScheduleChangesArguments {
  scheduleID: string;
}

export const gameScheduleChangesResolver = {
  subscribe: (
    model: unknown,
    args: GameScheduleChangesArguments,
    context: ApolloContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<unknown, unknown, undefined> =>
    pubsub.asyncIterator([GAME_SCHEDULE_CHANGED(args.scheduleID)]),
};

interface GamePatchArguments {
  gameID: string;
}

export const gamePatchResolver = {
  subscribe: withTransform<GamePatchSubscriptionData>(
    (
      model: unknown,
      args: GamePatchArguments,
      context: ApolloContext,
      info: GraphQLResolveInfo
    ): AsyncIterator<GamePatchSubscriptionData, unknown, undefined> => {
      const game = getGame(args.gameID);
      if (!game) {
        throw new GameNotFoundError();
      }
      return pubsub.asyncIterator([GAME_STATE_CHANGED]);
    },
    (payload, variable, context, info) => payload // FIXME: remove any field which should not be visible to the current player
  ),
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
    context.userID !== player.user.id
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
