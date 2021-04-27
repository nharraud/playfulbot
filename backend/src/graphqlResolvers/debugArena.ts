import { DebugArenaNotFoundError, ForbiddenError } from '~playfulbot/errors';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { DebugArena } from '~playfulbot/model/DebugArena';
import { pubsub } from '~playfulbot/pubsub';
import { TransformAsyncIterator } from '~playfulbot/pubsub/TransformedAsyncIterator';
import { VersionedAsyncIterator } from '~playfulbot/pubsub/VersionedAsyncIterator';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';

export const debugArenaResolver: gqlTypes.SubscriptionResolvers<ApolloContext>['debugArena'] = {
  subscribe: async (model, args, context, info) => {
    const arena = DebugArena.getDebugArena(args.userID, args.tournamentID);
    if (arena === undefined) {
      throw new DebugArenaNotFoundError();
    }
    const iterator = pubsub.listen('DEBUG_GAME', arena.id);

    const versionedIterator = new VersionedAsyncIterator(iterator, () => {
      const currentArena = DebugArena.getDebugArena(args.userID, args.tournamentID);
      if (currentArena === undefined) {
        throw new DebugArenaNotFoundError();
      }
      return Promise.resolve({
        id: currentArena.id,
        gameID: currentArena.game?.id,
        version: currentArena.version,
      });
    });

    return Promise.resolve(
      new TransformAsyncIterator(versionedIterator, (message) => ({
        debugArena: {
          id: arena.id,
          game: message.gameID,
          version: message.version,
        },
      }))
    );
  },
};

export const createNewDebugGameResolver: gqlTypes.MutationResolvers<ApolloContext>['createNewDebugGame'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new ForbiddenError('Only users are allowed to create games');
  }
  const arena = DebugArena.getDebugArena(args.userID, args.tournamentID);
  await arena.createNewGame();
  return true;
};
