import { ForbiddenError } from 'apollo-server-koa';

import { GameNotFoundError } from '~playfulbot/errors';

import { ApolloContext, isBotContext } from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';
import { Game } from '~playfulbot/model/Game';
import { pubsub } from '~playfulbot/pubsub';
import { VersionedAsyncIterator } from '~playfulbot/pubsub/VersionedAsyncIterator';
import { Player } from '~playfulbot/model/Player';
import { TransformAsyncIterator } from '~playfulbot/pubsub/TransformedAsyncIterator';
import { CombinedAsyncIterator } from '~playfulbot/pubsub/CombinedAsyncIterator';

export const gameResolver: gqlTypes.SubscriptionResolvers<ApolloContext>['game'] = {
  // There is no built-in way to confirm that a subscription is done via Graphql.
  // See https://github.com/apollographql/subscriptions-transport-ws/issues/451
  // Thus some messages might be missed. This is why we first send the whole game state
  subscribe: (model, args, context, info) => {
    const game = Game.getGame(args.gameID);
    if (game === undefined) {
      throw new GameNotFoundError();
    }

    const playerIterators = game.players.map((player) => {
      const playerIterator = pubsub.listen('PLAYER_CONNECTION_CHANGED', player.playerID);
      return new TransformAsyncIterator(playerIterator, (message) => ({
        game: {
          __typename: 'PlayerConnection',
          playerID: player.playerID,
          connected: message.connected,
        } as gqlTypes.PlayerConnection,
      }));
    });

    const iterator = pubsub.listen('GAME_CHANGED', args.gameID);
    const versionedIterator = new VersionedAsyncIterator(iterator, async () => {
      const currentGame = Game.getGame(args.gameID);
      if (currentGame === undefined) {
        throw new GameNotFoundError();
      }
      const players = currentGame.players.map((assignment) => {
        const player = Player.getPlayer(assignment.playerID);
        // FIXME: add the token only when allowed.
        return { id: player.id, token: player.token, connected: player.connected };
      });
      return Promise.resolve({
        id: currentGame.id,
        canceled: currentGame.canceled,
        version: currentGame.version,
        players,
        gameState: currentGame.gameState,
      });
    });

    setTimeout(() => {
      game.play(game.players[0].playerID, 'move', { vector: [0, -1] });
      game.play(game.players[1].playerID, 'move', { vector: [0, -1] });
    }, 3000);

    const transformedGameIterator = new TransformAsyncIterator(versionedIterator, (message) => {
      if ('patch' in message) {
        return {
          game: {
            gameID: game.id,
            __typename: 'GamePatch',
            patch: message.patch,
            version: message.version,
          } as gqlTypes.GamePatch,
        };
      }
      return {
        game: {
          __typename: 'Game',
          ...message,
        } as gqlTypes.Game,
      };
    });
    return new CombinedAsyncIterator([transformedGameIterator, ...playerIterators], true);
  },
};

export const playResolver: gqlTypes.MutationResolvers<ApolloContext>['play'] = (
  parent,
  args,
  context,
  info
): boolean => {
  const game = Game.getGame(args.gameID);

  if (isBotContext(context) && context.playerID !== args.playerID) {
    throw new ForbiddenError(`Bot is not allowed to play as player ${args.playerID}.`);
  }

  game.play(args.playerID, args.action, args.data);

  return true;
};
