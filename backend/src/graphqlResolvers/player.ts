import { Player } from '~playfulbot/model/Player';
import { pubsub } from '~playfulbot/pubsub';
import { ApolloContext } from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';
import { PlayerNotFoundError } from '~playfulbot/errors';
import { VersionedAsyncIterator } from '~playfulbot/pubsub/VersionedAsyncIterator';
import { PrefixedAsyncIterator } from '~playfulbot/pubsub/PrefixedAsyncIterator';
import { TransformAsyncIterator } from '~playfulbot/pubsub/TransformedAsyncIterator';

export const playerGamesResolver: gqlTypes.SubscriptionResolvers<ApolloContext>['playerGames'] = {
  subscribe: (model, args, context, info) => {
    const player = Player.getPlayer(args.playerID);
    if (player === undefined) {
      throw new PlayerNotFoundError();
    }
    const iterator = pubsub.listen('NEW_PLAYER_GAMES', player.id);

    const versionedIterator = new VersionedAsyncIterator(iterator, async () => {
      const currentPlayer = Player.getPlayer(args.playerID);
      if (currentPlayer === undefined) {
        throw new PlayerNotFoundError();
      }
      return Promise.resolve({
        playerID: currentPlayer.id,
        games: Array.from(currentPlayer.games),
        version: currentPlayer.version,
      });
    });

    return new TransformAsyncIterator(versionedIterator, (message) => {
      if ('playerID' in message) {
        return {
          playerGames: {
            __typename: 'PlayerGames',
            playerID: message.playerID,
            games: message.games,
          } as gqlTypes.PlayerGames,
        };
      }
      return {
        playerGames: {
          __typename: 'NewPlayerGames',
          games: message.games,
        } as gqlTypes.NewPlayerGames,
      };
    });
  },
};
