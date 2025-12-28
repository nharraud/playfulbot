import { Server } from "@grpc/grpc-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { RunningGameRepositoryInMemory } from "~game-runner/infrastructure/games/RunningGameRepositoryInMemory";
import { createGrpcServer } from "~game-runner/infrastructure/grpc/grpcServer";
import { createClient } from "./utils/createGrpcClient";
import { PlayfulBotGameRunnerClient } from "~game-runner/infrastructure/grpc/proto/types/playfulbot_runner/v0/PlayfulBotGameRunner";
import * as grpc from '@grpc/grpc-js';
import { createPlayerToken } from "playfulbot-backend-commons/lib/graphqlResolvers/authentication";
import { Game } from "~game-runner/core/entities/Game";
import { Stream } from "node:stream";
import { PubSubGameWatcher } from "~game-runner/infrastructure/PubSubGameWatcher";
import { DeferredPromise } from "playfulbot-backend-commons/lib/utils";
import { pubsub } from "~game-runner/infrastructure/pubsub";
import { GameState } from "playfulbot-game";

describe('grpc', () => {
  let client: PlayfulBotGameRunnerClient;
  let server: Server;
  let url: string;
  let gameRepository: RunningGameRepositoryInMemory;
  let game: Game;

  beforeEach(async () => {
    gameRepository = new RunningGameRepositoryInMemory();
    ({ server, url } = await createGrpcServer({ gameRepository }, { port: 0 }));
    client = await createClient(url);
    game = new Game('testGame', {
      actionHandler: (state: GameState & { count: number }, action: any) => {
        state.count = action[0]?.data?.count || state.count,
        state.end = action[0]?.data?.end || false;
      },
      init: () => ({ end: false, count: 42, players: [{ playing: true }, { playing: false }] }),
      name: 'TestGameDef'
    }, [{ playerID: 'testPlayer1' }, { playerID: 'testPlayer2' }]);
    game.watch(new PubSubGameWatcher());
    gameRepository.add(game);
  });

  afterEach(async () => {
    client.close();
    server.forceShutdown();
    game.cancel();
  });

  function endStreamPromise(stream: Stream) {
    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('end', () => {
        resolve(undefined);
      });
      stream.on('close', () => {
        resolve(undefined);
      });
    });
  }

  describe('FollowGame', () => {
    test('should throw error when there is no token', async () => {
      const authMetadata = new grpc.Metadata();
      const gameCall = client.FollowGame(authMetadata);
      const endPromise = endStreamPromise(gameCall);
      await expect(endPromise).rejects.toThrowError('invalid authentication token');
    });

    test('should throw error when token is invalid', async () => {
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', 'invalid token');
      const gameCall = client.FollowGame(authMetadata);
      const endPromise = endStreamPromise(gameCall);
      await expect(endPromise).rejects.toThrowError('invalid authentication token');
    });

    test('should return the initial game', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const gameCall = client.FollowGame(authMetadata);
      const endPromise = endStreamPromise(gameCall);
      gameCall.write({ gameId: 'testGame' });
      const response1 = await gameCall.iterator().next() as any;
      expect(response1).toMatchObject({value: { game: { id: 'testGame', canceled: false }}});
      gameCall.cancel();
      await expect(endPromise).rejects.toThrow('CANCELLED');
    });

    test('should stream game changes', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const gameCall = client.FollowGame(authMetadata);
      const endPromise = endStreamPromise(gameCall);
      gameCall.write({ gameId: 'testGame' });
      const iterator = gameCall.iterator();
      const response1 = await iterator.next() as any;
      expect(response1).toMatchObject({value: { game: { id: 'testGame', canceled: false, version: 0 }}});
      game.play(response1.value.game.player, { count: 21 });
      const response2 = await iterator.next() as any;
      expect(response2).toMatchObject({value: { patch: { gameId: 'testGame', patch: '[{"op":"replace","path":"/count","value":21}]', version: 1 }}});
      gameCall.cancel();
      await expect(endPromise).rejects.toThrow('CANCELLED');
    });

    test('should stream game end', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const gameCall = client.FollowGame(authMetadata);
      const endPromise = endStreamPromise(gameCall);
      gameCall.write({ gameId: 'testGame' });
      const iterator = gameCall.iterator();
      const response1 = await iterator.next() as any;
      expect(response1).toMatchObject({value: { game: { id: 'testGame', canceled: false, version: 0 }}});
      game.play(response1.value.game.player, { end: true });
      const response2 = await iterator.next() as any;
      expect(response2).toMatchObject({value: { patch: { gameId: 'testGame', patch: '[{"op":"replace","path":"/end","value":true}]', version: 1 }}});
      gameCall.cancel();
      await expect(endPromise).rejects.toThrow('CANCELLED');
    });

    test('should stream game cancellation after initial game state', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const gameCall = client.FollowGame(authMetadata);
      const endPromise = endStreamPromise(gameCall);
      gameCall.write({ gameId: 'testGame' });
      const iterator = gameCall.iterator();
      const response1 = await iterator.next() as any;
      expect(response1).toMatchObject({value: { game: { id: 'testGame', canceled: false, version: 0 }}});
      game.cancel();
      const response2 = await iterator.next() as any;
      expect(response2).toMatchObject({value: { canceled: { gameId: 'testGame', version: 1 }}});
      gameCall.cancel();
      await expect(endPromise).rejects.toThrow('CANCELLED');
    });

    test('should stream game cancellation during initial game state', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      game.cancel();
      authMetadata.set('authorization', token);
      const gameCall = client.FollowGame(authMetadata);
      const endPromise = endStreamPromise(gameCall);
      gameCall.write({ gameId: 'testGame' });
      const iterator = gameCall.iterator();
      const response1 = await iterator.next() as any;
      expect(response1).toMatchObject({value: { game: { id: 'testGame', canceled: true, version: 1 }}});
      gameCall.cancel();
      await expect(endPromise).rejects.toThrow('CANCELLED');
    });
  });


  describe('PlayGame', () => {

    function playGame(client: PlayfulBotGameRunnerClient, authMetadata: grpc.Metadata) {
      const startPromise = new DeferredPromise();
      const playCall = client.PlayGame(authMetadata, (error: Error, result: unknown) => {
        if (error) {
          return startPromise.reject(error);
        };
        startPromise.resolve(result);
      });
      return { cbPromise: startPromise.promise, playCall };
    }

    test('should fail to play without a token', async () => {
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', 'invalidToken');
      const { cbPromise, playCall } = playGame(client, authMetadata);
      playCall.write({ gameId: 'testGame', data: '{ "count": 12 }' });
      await expect(cbPromise).rejects.toThrowError(expect.objectContaining({ code: grpc.status.UNAUTHENTICATED }));
    });

    test('should fail to play without a token', async () => {
      const authMetadata = new grpc.Metadata();
      const { cbPromise, playCall } = playGame(client, authMetadata);
      playCall.write({ gameId: 'testGame', data: '{ "count": 12 }' });
      await expect(cbPromise).rejects.toThrowError(expect.objectContaining({ code: grpc.status.UNAUTHENTICATED }));
    });

    test('should fail to play game as an unknown player', async () => {
      const token = createPlayerToken('unknownPlayer');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const { cbPromise, playCall } = playGame(client, authMetadata);
      playCall.write({ gameId: 'testGame', data: '{ "count": 12 }' });
      await expect(cbPromise).rejects.toThrowError(expect.objectContaining({ code: grpc.status.PERMISSION_DENIED }));
    });

    test('should fail to play out of turn', async () => {
      const token = createPlayerToken('testPlayer2');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const { cbPromise, playCall } = playGame(client, authMetadata);
      playCall.write({ gameId: 'testGame', data: '{ "count": 12 }' });
      await expect(cbPromise).rejects.toThrowError(expect.objectContaining({ code: grpc.status.FAILED_PRECONDITION }));
    });

    test('should fail to play a finished game', async () => {
      game.play(0, { end: true });
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const { cbPromise, playCall } = playGame(client, authMetadata);
      playCall.write({ gameId: 'testGame', data: '{ "count": 12 }' });
      await expect(cbPromise).rejects.toThrowError(expect.objectContaining({ code: grpc.status.FAILED_PRECONDITION }));
    });

    test('should fail to play a cancelled game', async () => {
      game.cancel()
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const { cbPromise, playCall } = playGame(client, authMetadata);
      playCall.write({ gameId: 'testGame', data: '{ "count": 12 }' });
      await expect(cbPromise).rejects.toThrowError(expect.objectContaining({ code: grpc.status.FAILED_PRECONDITION }));
    });

    test('should fail to play a non existing game', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const { cbPromise, playCall } = playGame(client, authMetadata);
      playCall.write({ gameId: 'unknownGame', data: '{ "count": 12 }' });
      await expect(cbPromise).rejects.toThrowError(expect.objectContaining({ code: grpc.status.NOT_FOUND }));
    });

    test('should play the game', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const { cbPromise, playCall } = playGame(client, authMetadata);

      const changeIterator = pubsub.listen('GAME_CHANGED', 'testGame');
      playCall.write({ gameId: 'testGame', data: '{ "count": 12 }' });

      const change = await changeIterator.next();
      expect(change).toMatchObject({
        value: {
          patch: [
            {
              op: 'replace',
              path: '/count',
              value: 12,
            },
          ],
          version: 1
        }
      });
      playCall.end();
      await cbPromise;
    });

    test('should end the game', async () => {
      const token = createPlayerToken('testPlayer1');
      const authMetadata = new grpc.Metadata();
      authMetadata.set('authorization', token);
      const { cbPromise, playCall } = playGame(client, authMetadata);

      const changeIterator = pubsub.listen('GAME_CHANGED', 'testGame');
      playCall.write({ gameId: 'testGame', data: '{ "end": true }' });

      const change = await changeIterator.next();
      expect(change).toMatchObject({
        value: {
          patch: [
            {
              op: 'replace',
              path: '/end',
              value: true,
            },
          ],
          version: 1
        }
      });
      playCall.end();
      await cbPromise;
    });
  });
});
