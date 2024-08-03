
import { beforeEach, afterEach, describe, expect, test } from 'vitest';

// import { PSQLGameRepository } from 'tests/unit-tests/infrastructure/utils/PSQLGameRepository';
// import { basicGameDefinition } from '../mocks/mockGameDefinitions';
// import { randomUUID } from 'crypto';
// import { PSQLGameProvider } from '~game-runner/infrastructure/games/PSQLGameProvider';
import { createArena, dropTestDB, initTestDB, getGame } from './utils/psql';
import { PSQLGameRepository } from '~playfulbot/infrastructure/PSQLGameRepository';
import { PSQLGameRunnerMock } from './utils/PSQLGameRunnerMock';
import { db } from 'playfulbot-backend-commons/lib/model/db';
import { DeferredPromise } from '~playfulbot/utils/DeferredPromise';
import { rejects } from 'assert';

describe.only('infrastructure/games/PSQLGameRepository', () => {
  // const gameDefProvider = () => Promise.resolve(basicGameDefinition);
  let repositories: PSQLGameRepository[] = [];
  beforeEach(async () => {
    await initTestDB()
  });

  afterEach(async () => {
    for (const repository of repositories) {
      await repository.close();
    }
    repositories = [];
    // await PSQLGameRepository.stopAll();
    await dropTestDB();
  })

  async function createRepository() {
    const repository = await PSQLGameRepository.createRepository(db.default);
    repositories.push(repository);
    return repository;
  }

  test('should init and stop', async () => {
    await createRepository();
  });

  test('should add game', async () => {
    const psqlGameRepository = await createRepository();
    const gamePromise = psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }]});
    const runner = await PSQLGameRunnerMock.create();
    const fetchedGame = await runner.fetchGame();
    await expect(gamePromise).resolves.toEqual({ gameId: fetchedGame.id });
    expect(fetchedGame).toMatchObject({
      game_def_id: 'foo',
      players: [{ playerID: '42' }]
    });
  });

  test('should set game arena', async () => {
    const psqlGameRepository = await createRepository();
    await createArena('myarenaID');
    const gamePromise = psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' });
    const runner = await PSQLGameRunnerMock.create();
    const fetchedGame = await runner.fetchGame();
    await expect(gamePromise).resolves.toEqual({ gameId: fetchedGame.id });
    expect(fetchedGame).toMatchObject({
      game_def_id: 'foo',
      players: [{ playerID: '42' }],
      arena: 'myarenaID',
    });
  });

  test('[getArenaLatestGame] should retrieve latest game by arenaId', async () => {
    const psqlGameRepository = await createRepository();
    await createArena('myarenaID');
    const runner = await PSQLGameRunnerMock.create();
    await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' });
    const latestGameRef = await  psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' });
    await runner.fetchGame();
    await runner.fetchGame();
    const gameRefPromise = psqlGameRepository.getArenaLatestGame('myarenaID');
    const { started_at } = await getGame(latestGameRef.gameId);
    await expect(gameRefPromise).resolves.toEqual({
      gameId: latestGameRef.gameId,
      runnerId: runner.runnerId,
      startedAt: started_at,
    });
  });

  test('[getArenaGameStream] should stream games', async () => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' };
    const psqlGameRepository = await createRepository();
    await createArena('myarenaID');
    const runner1 = await PSQLGameRunnerMock.create();
    const runner2 = await PSQLGameRunnerMock.create();
    const game1 = await psqlGameRepository.addGame(gameParams);
    await runner1.fetchGame();
    const stream = await psqlGameRepository.streamArenaGames('myarenaID');
    const game2 = await  psqlGameRepository.addGame(gameParams);
    const game3 = await  psqlGameRepository.addGame(gameParams);
    await runner2.fetchGame();
    await runner1.fetchGame();
    const streamedGames = [];
    for await (const game of stream) {
      streamedGames.push(game);
      if (streamedGames.length === 3) {
        break;
      }
    }
    expect(streamedGames).toEqual([
      { gameId: game1.gameId, runnerId: runner1.runnerId },
      { gameId: game2.gameId, runnerId: runner2.runnerId },
      { gameId: game3.gameId, runnerId: runner1.runnerId },
    ]);
  });

  test('[getArenaGameStream] should stop listening arena games only when all streams are read', async () => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' };
    const psqlGameRepository = await createRepository();
    await createArena('myarenaID');
    const runner = await PSQLGameRunnerMock.create();
    const game1 = await psqlGameRepository.addGame(gameParams);
    await runner.fetchGame();
    const stream1 = await psqlGameRepository.streamArenaGames('myarenaID');
    const stream2 = await psqlGameRepository.streamArenaGames('myarenaID');
    for await (const game of stream1) {
      break;
    }
    expect(psqlGameRepository.isListeningOnArenaGames('myarenaID')).toBeTruthy();
    for await (const game of stream2) {
      break;
    }
    expect(psqlGameRepository.isListeningOnArenaGames('myarenaID')).toBeFalsy();
  });

  test('[getArenaGameStream] should stream games independently from other streams for the same arena', async () => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' };
    const psqlGameRepository = await createRepository();
    await createArena('myarenaID');
    const runner1 = await PSQLGameRunnerMock.create();
    const runner2 = await PSQLGameRunnerMock.create();
    const game1 = await psqlGameRepository.addGame(gameParams);
    await runner1.fetchGame();
    const stream1 = await psqlGameRepository.streamArenaGames('myarenaID');
    const game2 = await  psqlGameRepository.addGame(gameParams);
    await runner2.fetchGame();
    const stream2 = await psqlGameRepository.streamArenaGames('myarenaID');
    const game3 = await  psqlGameRepository.addGame(gameParams);
    await runner1.fetchGame();
    const streamedGames1 = [];
    for await (const game of stream1) {
      streamedGames1.push(game);
      if (streamedGames1.length === 3) {
        break;
      }
    }
    const game4 = await  psqlGameRepository.addGame(gameParams);
    await runner1.fetchGame();
    const streamedGames2 = [];
    for await (const game of stream2) {
      streamedGames2.push(game);
      if (streamedGames2.length === 3) {
        break;
      }
    }
    expect(streamedGames1).toEqual([
      { gameId: game1.gameId, runnerId: runner1.runnerId },
      { gameId: game2.gameId, runnerId: runner2.runnerId },
      { gameId: game3.gameId, runnerId: runner1.runnerId },
    ]);
    expect(streamedGames2).toEqual([
      { gameId: game2.gameId, runnerId: runner2.runnerId },
      { gameId: game3.gameId, runnerId: runner1.runnerId },
      { gameId: game4.gameId, runnerId: runner1.runnerId },
    ]);
  });
});
