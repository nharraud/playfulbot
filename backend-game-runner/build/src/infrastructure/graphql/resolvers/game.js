import { pubsub } from '~game-runner/infrastructure/pubsub';
import { VersionedAsyncIterator } from 'mem-pubsub/lib/VersionedAsyncIterator.js';
import { TransformAsyncIterator } from 'mem-pubsub/lib/TransformAsyncIterator.js';
// import { CombinedAsyncIterator } from 'playfulbot-backend-commons/lib/pubsub/CombinedAsyncIterator.js';
import { GameNotFoundError, ForbiddenError } from '~game-runner/infrastructure/graphql/errors';
import { isBotContext } from '~game-runner/infrastructure/graphql/types/apolloTypes';
// import { Player } from '~game-runner/model/Player';
export const gameResolver = {
    // There is no built-in way to confirm that a subscription is done via Graphql.
    // See https://github.com/apollographql/subscriptions-transport-ws/issues/451
    // Thus some messages might be missed. This is why we first send the whole game state
    // TODO: check this again now that we switched to graphql-ws instead of subscriptions-transport-ws
    subscribe: (model, args, context, info) => {
        const game = context.deps.gameRepository.get(args.gameID);
        // const game = Game.getGame(args.gameID);
        if (game === undefined) {
            throw new GameNotFoundError();
        }
        // const playerIterators = game.players.map((player) => {
        //   const playerIterator = pubsub.listen('PLAYER_CONNECTION_CHANGED', player.playerID);
        //   return new TransformAsyncIterator(playerIterator, (message) => ({
        //     game: {
        //       __typename: 'PlayerConnection',
        //       playerID: player.playerID,
        //       connected: message.connected,
        //     } as gqlTypes.PlayerConnection,
        //   }));
        // });
        const iterator = pubsub.listen('GAME_CHANGED', args.gameID);
        const versionedIterator = new VersionedAsyncIterator(iterator, async () => {
            const currentGame = context.deps.gameRepository.get(args.gameID);
            // const currentGame = Game.getGame(args.gameID);
            if (currentGame === undefined) {
                throw new GameNotFoundError();
            }
            const players = currentGame.players.map((assignment) => {
                return { id: assignment.playerID, token: '', connected: true };
                // const player = Player.getPlayer(assignment.playerID);
                // FIXME: add the token only when allowed.
                // return { id: player.id, token: player.token, connected: player.connected };
            });
            return Promise.resolve({
                id: currentGame.id,
                canceled: currentGame.cancelled,
                version: currentGame.version,
                players,
                winners: currentGame.winners || null,
                initialState: currentGame.initialState,
                patches: currentGame.patches,
            });
        });
        const transformedGameIterator = new TransformAsyncIterator(versionedIterator, (message) => {
            if ('patch' in message) {
                return {
                    game: {
                        gameID: game.id,
                        __typename: 'GamePatch',
                        patch: message.patch,
                        version: message.version,
                        winners: message.winners || null,
                    },
                };
            }
            else if (message?.canceled) {
                return {
                    game: {
                        gameID: game.id,
                        __typename: 'GameCanceled',
                        version: message.version
                    },
                };
            }
            return {
                game: {
                    __typename: 'Game',
                    ...message,
                },
            };
        });
        // return new CombinedAsyncIterator([transformedGameIterator, ...playerIterators], true);
        return transformedGameIterator;
    },
};
export const playResolver = (parent, args, context, info) => {
    // const game = Game.getGame(args.gameID);
    const game = context.deps.gameRepository.get(args.gameID);
    if (isBotContext(context) && context.playerID !== args.playerID) {
        throw new ForbiddenError(`Bot is not allowed to play as player ${args.playerID}.`);
    }
    game.play(args.playerID, args.data);
    return true;
};
//# sourceMappingURL=game.js.map