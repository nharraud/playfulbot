import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { createArena } from '~playfulbot/core/use-cases/arena/createArena';
import { toGraphQLError } from './errors';
import { AuthenticationError } from '~playfulbot/errors';
import { createArenaGame } from '~playfulbot/core/use-cases/arena/createArenaGame';
import { streamArenaGames } from '~playfulbot/core/use-cases/arena/streamArenaGames';
import { AsyncStream } from 'mem-pubsub/lib/AsyncStream';
import { GameRef } from '~playfulbot/core/entities/GameRef';
import { TransformAsyncIterator } from 'mem-pubsub/lib/TransformAsyncIterator';
import { getArena } from '~playfulbot/core/use-cases/arena/getArena';
import { deleteArena } from '~playfulbot/core/use-cases/arena/deleteArena';

export const arenaGamesResolver: gqlTypes.SubscriptionResolvers<GraphqlContext>['arenaGames'] = {
  subscribe: async (model, args, graphqlContext, info) => {
    if (!isUserContext(graphqlContext)) {
      throw new AuthenticationError('Only users are allowed to create games')
    }
    const result = await streamArenaGames(graphqlContext.ctx, { arenaId: args.arenaID, userId: graphqlContext.userID })

    if (result instanceof Error) {
      const errorStream = new AsyncStream<gqlTypes.ArenaGamesFailure>();
      errorStream.push({
        __typename: 'ArenaGamesFailure',
        errors: [toGraphQLError(result)],
      });
      errorStream.complete();
      return errorStream;
    }
    return new TransformAsyncIterator(result[Symbol.asyncIterator](), async (game: GameRef) => ({
      __typename: 'GameRef',
      gameID: game.gameId,
      graphqlUrl: (await graphqlContext.ctx.providers.gameRepository.getRunnerInfo(game.runnerId)).graphqlUrl,
    } as gqlTypes.GameRef));

  },
  resolve: (value: any) => {
    return value;
  }
};

export const createArenaGameResolver: gqlTypes.MutationResolvers<GraphqlContext>['createArenaGame'] = async (
    parent,
    args,
    graphqlContext
) => {
    if (!isUserContext(graphqlContext)) {
      throw new AuthenticationError('Only users are allowed to create games')
    }

    const result = await createArenaGame(graphqlContext.ctx, { userId: graphqlContext.userID, arenaId: args.arenaID });

    if (result instanceof Error) {
      return {
        __typename: 'CreateArenaGameFailure',
        errors: [toGraphQLError(result)],
      };
    }
    return {
      __typename: 'CreateArenaGameSuccess',
      gameID: result.gameId
    };
};

export const createArenaResolver: gqlTypes.MutationResolvers<GraphqlContext>['createArena'] = async (
    parent,
    args,
    graphqlContext
) => {
    if (!isUserContext(graphqlContext)) {
      throw new AuthenticationError('Only users are allowed to create arenas')
    }
    
    const result = await createArena(graphqlContext.ctx, { teamId: args.teamID, userId: graphqlContext.userID, arenaName: args.name });

    if (result instanceof Error) {
      return {
        __typename: 'CreateArenaFailure',
        errors: [toGraphQLError(result)],
      };
    }
    return {
      __typename: 'CreateArenaSuccess',
      arena: result
    };
};


export const getArenaResolver: gqlTypes.MutationResolvers<GraphqlContext>['getArena'] = async (
    parent,
    args,
    graphqlContext
) => {
    if (!isUserContext(graphqlContext)) {
      throw new AuthenticationError('Only users are allowed to create games')
    }

    const result = await getArena(graphqlContext.ctx, args.arenaID);

    if (result instanceof Error) {
      return {
        __typename: 'GetArenaFailure',
        errors: [toGraphQLError(result)],
      };
    }
    return {
      __typename: 'GetArenaSuccess',
      arena: result
    };
};

export const deleteArenaResolver: gqlTypes.MutationResolvers<GraphqlContext>['deleteArena'] = async (
    parent,
    args,
    graphqlContext
) => {
    if (!isUserContext(graphqlContext)) {
      throw new AuthenticationError('Only users are allowed to delete arenas')
    }

    const result = await deleteArena(graphqlContext.ctx, { userId: graphqlContext.userID, arenaId: args.arenaID });

    if (result instanceof Error) {
      return {
        __typename: 'DeleteArenaFailure',
        errors: [toGraphQLError(result)],
      };
    }
    return {
      __typename: 'DeleteArenaSuccess',
      arenaID: result,
    };
};