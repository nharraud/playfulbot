import { pubsub } from '~playfulbot/pubsub';
import { ApolloContext } from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';
import { TeamNotFoundError } from '~playfulbot/errors';
import { Team } from '~playfulbot/infrastructure/TeamsPSQL';
import { db } from '~playfulbot/model/db';
import { TransformAsyncIterator } from '~playfulbot/pubsub/TransformedAsyncIterator';
import { PrefixedAsyncIterator } from '~playfulbot/pubsub/PrefixedAsyncIterator';

export const teamPlayerResolver: gqlTypes.SubscriptionResolvers<ApolloContext>['teamPlayer'] = {
  subscribe: (model, args, context, info) =>
    db.default.tx(async (tx) => {
      const team = await Team.getByID(args.teamID, tx);
      if (team === undefined) {
        throw new TeamNotFoundError();
      }
      const player = team.getTournamentPlayer();
      const playerIterator = pubsub.listen('PLAYER_CONNECTION_CHANGED', player.id);
      const connectionChanges = new TransformAsyncIterator(playerIterator, (message) => ({
        teamPlayer: {
          __typename: 'PlayerConnection',
          playerID: player.id,
          connected: message.connected,
        } as gqlTypes.PlayerConnection,
      }));

      // FIXME: version the connection.
      return new PrefixedAsyncIterator(connectionChanges, async () =>
        Promise.resolve({
          teamPlayer: {
            __typename: 'Player',
            id: player.id,
            token: player.token,
            connected: player.connected,
          } as gqlTypes.Player,
        })
      );
    }),
};
