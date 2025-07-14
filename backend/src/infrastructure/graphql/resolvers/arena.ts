// import { AuthenticationError, DebugArenaNotFoundError, ForbiddenError } from '~playfulbot/errors';
// import { DebugArena } from '~playfulbot/infrastructure/providers/ArenaProviderPSQL';
import { pubsub } from '~playfulbot/pubsub';
import { TransformAsyncIterator } from '~playfulbot/pubsub/TransformedAsyncIterator';
import { VersionedAsyncIterator } from '~playfulbot/pubsub/VersionedAsyncIterator';
import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { createArena } from '~playfulbot/core/use-cases/arena/createArena';
import { toGraphQLError } from './errors';
import { Arena } from '~playfulbot/core/entities/Arena';
import { MaxArenaReachedError } from '~playfulbot/core/use-cases/interfaces/ArenaProvider';
import { AuthenticationError } from '~playfulbot/errors';
import { createArenaGame } from '~playfulbot/core/use-cases/arena/createArenaGame';

// export const arenaResolver: gqlTypes.SubscriptionResolvers<GraphqlContext>['arena'] = {
//   subscribe: async (model, args, context, info) => {
//     const arena = DebugArena.getDebugArena(args.userID, args.tournamentID);
//     if (arena === undefined) {
//       throw new DebugArenaNotFoundError();
//     }
//     const iterator = pubsub.listen('DEBUG_GAME', arena.id);

//     const versionedIterator = new VersionedAsyncIterator(iterator, () => {
//       const currentArena = DebugArena.getDebugArena(args.userID, args.tournamentID);
//       if (currentArena === undefined) {
//         throw new DebugArenaNotFoundError();
//       }
//       return Promise.resolve({
//         id: currentArena.id,
//         gameID: currentArena.game?.id,
//         version: currentArena.version,
//       });
//     });

//     return Promise.resolve(
//       new TransformAsyncIterator(versionedIterator, (message) => ({
//         debugArena: {
//           id: arena.id,
//           game: message.gameID,
//           version: message.version,
//         },
//       }))
//     );
//   },
// };

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
