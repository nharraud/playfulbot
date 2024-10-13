
import { beforeEach, afterEach, describe, expect, test } from 'vitest';
import { createArena, dropTestDB, initTestDB, getGame, endGame } from './utils/psql';
import { GameRepositoryPSQL } from '~playfulbot/infrastructure/GameRepositoryPSQL';
import { PSQLGameRunnerMock } from './utils/PSQLGameRunnerMock';
import { db } from 'playfulbot-backend-commons/lib/model/db';
import { GameRef } from '~playfulbot/core/use-cases/GameRef';

describe('infrastructure/GameRepositoryPLSQL', () => {
  let repositories: GameRepositoryPSQL[] = [];
  beforeEach(async () => {
    await initTestDB()
  });

  afterEach(async () => {
    for (const repository of repositories) {
      await repository.close();
    }
    repositories = [];
    await dropTestDB();
  })

  async function createRepository() {
    const repository = await GameRepositoryPSQL.createRepository(db.default);
    repositories.push(repository);
    return repository;
  }

  async function gameStreamToArray<T>(stream: AsyncIterable<T>, nbItems: number) {
    const streamedGames = [];
    for await (const games of stream) {
      streamedGames.push(games);
      if (streamedGames.length === nbItems) {
        break;
      }
    }
    return streamedGames;
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

  test('[getGamesByPlayer] should retrieve games by playerId', async () => {
    const psqlGameRepository = await createRepository();
    await createArena('myarenaID');
    const runner = await PSQLGameRunnerMock.create();
    const game1Ref = await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '21' }], arena: 'myarenaID' });
    const game2Ref = await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '22' }], arena: 'myarenaID' });
    await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: 'Other' }], arena: 'myarenaID' });
    const game3Ref = await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '23' }], arena: 'myarenaID' });
    await runner.fetchGame();
    await runner.fetchGame();
    await runner.fetchGame();
    await runner.fetchGame();
    game1Ref.runnerId = runner.runnerId;
    game2Ref.runnerId = runner.runnerId;
    game3Ref.runnerId = runner.runnerId;
    const gameRefs = await psqlGameRepository.getGamesByPlayer('42');
    expect(gameRefs).toEqual([game1Ref, game2Ref, game3Ref]);
  });

  test('[streamPlayerGames] should stream games', async () => {
    const psqlGameRepository = await createRepository();
    const runner1 = await PSQLGameRunnerMock.create();
    const runner2 = await PSQLGameRunnerMock.create();
    const game1 = await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }, { playerID: '21' }] });
    await runner1.fetchGame();
    const stream = await psqlGameRepository.streamPlayerGames('42');

    const streamedGames = gameStreamToArray(stream, 3);
    
    const game2 = await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '22' }, { playerID: '42' }] });
    await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: 'Other' }] });
    const game3 = await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '23' }] });
    await runner2.fetchGame();
    await runner1.fetchGame();
    await runner1.fetchGame();
    await expect(streamedGames).resolves.toEqual([
      { gameId: game1.gameId, runnerId: runner1.runnerId },
      { gameId: game2.gameId, runnerId: runner2.runnerId },
      { gameId: game3.gameId, runnerId: runner1.runnerId },
    ]);
  });

  test('[streamPlayerGames] should stop listening player games only when all streams are read', async () => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }] };
    const psqlGameRepository = await createRepository();
    const runner = await PSQLGameRunnerMock.create();
    const game1 = await psqlGameRepository.addGame(gameParams);
    await runner.fetchGame();
    const stream1 = await psqlGameRepository.streamPlayerGames('42');
    const stream2 = await psqlGameRepository.streamPlayerGames('42');
    for await (const game of stream1) {
      break;
    }
    expect(psqlGameRepository.isListeningOnPlayerGames('42')).toBeTruthy();
    for await (const game of stream2) {
      break;
    }
    expect(psqlGameRepository.isListeningOnPlayerGames('42')).toBeFalsy();
  });

  test('[streamPlayerGames] should stream games independently from other streams for the same arena', async () => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }] };
    const psqlGameRepository = await createRepository();
    const runner1 = await PSQLGameRunnerMock.create();

    let games: GameRef[] = [];
    async function addGame() {
      const game = await psqlGameRepository.addGame(gameParams);
      games.push(game);
      await runner1.fetchGame();
    }

    setTimeout(async () => {
      await addGame();
      await addGame();
      await addGame();
    }, 100);
  
    const stream1 = await psqlGameRepository.streamPlayerGames('42');
    const it1 = stream1[Symbol.asyncIterator]();
    const it1Game1 = (await it1.next()).value;
    const it1Game2 = (await it1.next()).value;
    const it1Game3 = (await it1.next()).value;

    await endGame(games[1].gameId);

    setTimeout(async () => {
      await addGame();
      await addGame();
    }, 100);

  
    const stream2 = await psqlGameRepository.streamPlayerGames('42');
    const it2 = stream2[Symbol.asyncIterator]();
    const it2Game1 = (await it2.next()).value;
    const it2Game2 = (await it2.next()).value;
    const it2Game3 = (await it2.next()).value;
    const it2Game4 = (await it2.next()).value;

    const it1Game4 = (await it1.next()).value;
    const it1Game5 = (await it1.next()).value;
  
    expect([it1Game1, it1Game2, it1Game3, it1Game4, it1Game5]).toEqual([
      { gameId: games[0].gameId, runnerId: runner1.runnerId },
      { gameId: games[1].gameId, runnerId: runner1.runnerId },
      { gameId: games[2].gameId, runnerId: runner1.runnerId },
      { gameId: games[3].gameId, runnerId: runner1.runnerId },
      { gameId: games[4].gameId, runnerId: runner1.runnerId },
    ]);
    expect([it2Game1, it2Game2, it2Game3, it2Game4]).toEqual([
      { gameId: games[0].gameId, runnerId: runner1.runnerId },
      { gameId: games[2].gameId, runnerId: runner1.runnerId },
      { gameId: games[3].gameId, runnerId: runner1.runnerId },
      { gameId: games[4].gameId, runnerId: runner1.runnerId },
    ]);
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
    const psqlGameRepository = await createRepository();
    await createArena('myarenaID');
    const runner1 = await PSQLGameRunnerMock.create();
    const runner2 = await PSQLGameRunnerMock.create();
    const game1 = await psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' });
    await runner1.fetchGame();
    const stream = await psqlGameRepository.streamArenaGames('myarenaID');

    const streamedGames = gameStreamToArray(stream, 3);
    
    const game2 = await  psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' });
    const game3 = await  psqlGameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arena: 'myarenaID' });
    await runner2.fetchGame();
    await runner1.fetchGame();
    await expect(streamedGames).resolves.toEqual([
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

    let games: GameRef[] = [];
    async function addGame() {
      const game = await psqlGameRepository.addGame(gameParams);
      games.push(game);
      runner1.fetchGame();
    }

    setTimeout(async () => {
      await addGame();
      await addGame();
    }, 100);
  
    const stream1 = await psqlGameRepository.streamArenaGames('myarenaID');
    const it1 = stream1[Symbol.asyncIterator]();
    const it1Game1 = (await it1.next()).value;
    const it1Game2 = (await it1.next()).value;

    setTimeout(async () => {
      await addGame();
      await addGame();
    }, 100);
  
    const stream2 = await psqlGameRepository.streamArenaGames('myarenaID');
    const it2 = stream2[Symbol.asyncIterator]();
    const it2Game1 = (await it2.next()).value;
    const it2Game2 = (await it2.next()).value;
    const it2Game3 = (await it2.next()).value;

    const it1Game3 = (await it1.next()).value;
    const it1Game4 = (await it1.next()).value;
  
    expect([it1Game1, it1Game2, it1Game3, it1Game4]).toEqual([
      { gameId: games[0].gameId, runnerId: runner1.runnerId },
      { gameId: games[1].gameId, runnerId: runner1.runnerId },
      { gameId: games[2].gameId, runnerId: runner1.runnerId },
      { gameId: games[3].gameId, runnerId: runner1.runnerId },
    ]);
    expect([it2Game1, it2Game2, it2Game3]).toEqual([
      { gameId: games[1].gameId, runnerId: runner1.runnerId },
      { gameId: games[2].gameId, runnerId: runner1.runnerId },
      { gameId: games[3].gameId, runnerId: runner1.runnerId },
    ]);
  });
});
