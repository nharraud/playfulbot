import { afterEach, beforeEach, beforeAll, describe, expect, test, vi, afterAll } from 'vitest';
import { createGraphqlServer } from '~game-runner/infrastructure/graphql/graphqlServer';
// import { graphql } from 'graphql';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';
import { serverConfig } from '~game-runner/serverConfig';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from 'playfulbot-backend-commons/lib/secret';
import { RunningGameRepositoryInMemory } from '~game-runner/infrastructure/games/RunningGameRepositoryInMemory';
import { Game } from '~game-runner/core/entities/Game';
import { PubSubGameWatcher } from '~game-runner/infrastructure/PubSubGameWatcher';
;
const changeNumberHandler = (state, actions) => {
    if (actions[0].data.number) {
        state.number = actions[0].data.number;
    }
    if (actions[0].data.wins) {
        state.end = true;
        state.players[0].winner = true;
    }
};
function basicInit() {
    return {
        end: false,
        players: [{ playing: true }],
        number: 0
    };
}
const basicGameDefinition = { name: 'TestGame', actionHandler: changeNumberHandler, init: basicInit };
describe('graphql', () => {
    let client;
    let server;
    let url = `ws://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}/graphql`;
    let gameRepository = new RunningGameRepositoryInMemory();
    beforeAll(async () => {
        server = await createGraphqlServer({ gameRepository });
    });
    function createTestClient(params) {
        client = createClient({ url, webSocketImpl: WebSocket, ...params });
        return client;
    }
    afterAll(async () => {
        client.terminate();
        await server.close();
    });
    describe('errors', () => {
        beforeAll(async () => {
            // hide error logs
            vi.spyOn(console, 'error').mockImplementation(() => undefined);
        });
        test('should fail if no connectionParams are provided', async () => {
            createTestClient({});
            const query = client.iterate({ query: '' });
            let error;
            try {
                await query.next();
            }
            catch (err) {
                error = err;
            }
            expect(error?.reason).toEqual('Missing token.');
        });
        test('should fail if no auth token is provided', async () => {
            createTestClient({ connectionParams: {} });
            const query = client.iterate({ query: '' });
            let error;
            try {
                await query.next();
            }
            catch (err) {
                error = err;
            }
            expect(error?.reason).toEqual('Missing token.');
        });
        test('should fail if the provided authToken is invalid', async () => {
            createTestClient({ connectionParams: { authToken: 'anInvalidToken' } });
            const query = client.iterate({ query: '' });
            let error;
            try {
                await query.next();
            }
            catch (err) {
                error = err;
            }
            expect(error?.reason).toEqual('Invalid authorization token: token validation failed.');
        });
        test('should fail when the provided game ID does not exist', async () => {
            const authToken = jwt.sign({ playerID: 'myPlayer' }, SECRET_KEY);
            createTestClient({ connectionParams: { authToken } });
            const query = client.iterate({
                query: 'subscription { game(gameID: "42") { ... on Game { id } } }',
            });
            const message = await query.next();
            expect(message.value.errors[0]?.message).toEqual('Game not found');
        });
    });
    describe('with existing game', () => {
        let game;
        beforeEach(() => {
            game = new Game('testgame', basicGameDefinition, [{ playerID: 'a' }]);
            game.watch(new PubSubGameWatcher());
            gameRepository.add(game);
        });
        afterEach(() => {
            gameRepository.clear();
        });
        test('should return the initial state when subscribing', async () => {
            const authToken = jwt.sign({ playerID: 'myPlayer' }, SECRET_KEY);
            createTestClient({ connectionParams: { authToken } });
            const query = client.iterate({
                query: `subscription { game(gameID: "${game.id}") { ... on Game { id, version, initialState } } }`,
            });
            const message = await query.next();
            expect(message.value.data.game).toEqual({
                id: game.id,
                initialState: {
                    end: false,
                    number: 0,
                    players: [{ playing: true }],
                },
                version: 0,
            });
        });
        test('should return the current patches if the connection happens after the game was played', async () => {
            const authToken = jwt.sign({ playerID: 'myPlayer' }, SECRET_KEY);
            createTestClient({ connectionParams: { authToken } });
            game.play(0, { number: 21 });
            game.play(0, { number: 42 });
            const query = client.iterate({
                query: `subscription { game(gameID: "${game.id}") { ... on Game { id, version, initialState, patches } } }`,
            });
            const message = await query.next();
            expect(message.value.data.game).toEqual({
                id: game.id,
                initialState: {
                    end: false,
                    number: 0,
                    players: [{ playing: true }],
                },
                patches: [
                    [{ op: 'replace', path: '/number', value: 21 }],
                    [{ op: 'replace', path: '/number', value: 42 }],
                ],
                version: 2,
            });
        });
        test('should return patches when the game is played', async () => {
            const authToken = jwt.sign({ playerID: 'myPlayer' }, SECRET_KEY);
            createTestClient({ connectionParams: { authToken } });
            const query = client.iterate({
                query: `subscription { game(gameID: "${game.id}") {
          ... on Game { id, version, initialState, patches }
          ... on GamePatch { gameID, version, patch }
        } }`,
            });
            const firstMessage = await query.next();
            expect(firstMessage.value.data.game.version).toEqual(0);
            game.play(0, { number: 21 });
            const secondMessage = await query.next();
            expect(secondMessage.value.data.game).toEqual({
                gameID: game.id,
                patch: [{ op: 'replace', path: '/number', value: 21 }],
                version: 1,
            });
        });
        test('should notify when a player wins', async () => {
            const authToken = jwt.sign({ playerID: 'myPlayer' }, SECRET_KEY);
            createTestClient({ connectionParams: { authToken } });
            const query = client.iterate({
                query: `subscription { game(gameID: "${game.id}") {
          ... on Game { id, version, initialState, patches }
          ... on GamePatch { gameID, version, patch, winners }
        } }`,
            });
            const firstMessage = await query.next();
            expect(firstMessage.value.data.game.version).toEqual(0);
            game.play(0, { wins: true });
            const secondMessage = await query.next();
            expect(secondMessage.value.data.game).toEqual({
                gameID: game.id,
                patch: [
                    { op: 'add', path: '/players/0/winner', value: true },
                    { op: 'replace', path: '/end', value: true },
                ],
                version: 1,
                winners: [0]
            });
            const lastMessage = await query.next();
            expect(lastMessage.done).toEqual(true);
        });
        test('should notify when the game is cancelled', async () => {
            const authToken = jwt.sign({ playerID: 'myPlayer' }, SECRET_KEY);
            createTestClient({ connectionParams: { authToken } });
            const query = client.iterate({
                query: `subscription { game(gameID: "${game.id}") {
          ... on Game { id, version, canceled }
          ... on GamePatch { gameID, version, patch, winners }
          ... on GameCanceled { gameID, version }
        } }`,
            });
            const firstMessage = await query.next();
            expect(firstMessage.value.data.game.version).toEqual(0);
            game.cancel();
            const secondMessage = await query.next();
            expect(secondMessage.value.data.game).toEqual({
                gameID: game.id,
                version: 1
            });
            const lastMessage = await query.next();
            expect(lastMessage.done).toEqual(true);
        });
    });
});
//# sourceMappingURL=server.test.js.map