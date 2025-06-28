
import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB, initTestDB, getGame, endGame } from '../../utils/psql';
import { mockContextFixture } from '../../utils/fixtures';
import { GameRepositoryPSQL } from '~playfulbot/infrastructure/providers/GameRepositoryPSQL';
import { PSQLGameRunnerMock } from '../../utils/PSQLGameRunnerMock';
import { db } from 'playfulbot-backend-commons/lib/model/db';
import { GameRef } from '~playfulbot/core/use-cases/interfaces/GameRef';
import { Arena } from '~playfulbot/core/entities/Arena';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { User } from '~playfulbot/core/entities/Users';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';

async function gameRepositoryFixture({ ctx }: Omit<TestFixtures, 'gameRepository'>, use: any) {     
  await use(ctx.providers.gameRepository);
}

async function arenaFixture({ ctx }: Omit<TestFixtures, 'arena'>, use: any) {
  const tournament = await ctx.providers.tournament.createTournament(ctx, {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  }) as Tournament;

  const team = await ctx.providers.team.createTeam(ctx, {
    name: 'testTeam',
    tournamentID: tournament.id
  }) as Team;
  // const user = await ctx.providers.user.createUser(ctx, {
  //   username: 'testUser',
  //   password: 'mypassword'
  // }) as User;
  const arena = await ctx.providers.arena.createArena(ctx, { teamId: team.id, name: 'testArena' });
  await use(arena);
}

interface TestFixtures {
  ctx: Context<any>,
  gameRepository: GameRepositoryPSQL,
  arena: Arena,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  gameRepository: gameRepositoryFixture,
  arena: arenaFixture,
});

describe('infrastructure/GameRepositoryPLSQL', () => {
  afterEach<TestFixtures>(async ({ gameRepository }) => {
    gameRepository.close();
    await dropTestDB();
  })

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

  test('should init and stop', async ({ gameRepository }) => {});

  test('should add game', async ({ gameRepository }) => {
    const gamePromise = gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }]});
    const runner = await PSQLGameRunnerMock.create();
    const fetchedGame = await runner.fetchGame();
    await expect(gamePromise).resolves.toEqual({ gameId: fetchedGame.id });
    expect(fetchedGame).toMatchObject({
      game_def_id: 'foo',
      players: [{ playerID: '42' }]
    });
  });

  test('should set game arena', async ({ arena, gameRepository }) => {
    const gamePromise = gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id });
    const runner = await PSQLGameRunnerMock.create();
    const fetchedGame = await runner.fetchGame();
    await expect(gamePromise).resolves.toEqual({ gameId: fetchedGame.id });
    expect(fetchedGame).toMatchObject({
      game_def_id: 'foo',
      players: [{ playerID: '42' }],
      arena_id: arena.id,
    });
  });

  test('[getGamesByPlayer] should retrieve games by playerId', async ({ gameRepository, arena }) => {
    const runner = await PSQLGameRunnerMock.create();
    const game1Ref = await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '21' }], arenaId: arena.id });
    const game2Ref = await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '22' }], arenaId: arena.id });
    await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: 'Other' }], arenaId: arena.id });
    const game3Ref = await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '23' }], arenaId: arena.id });
    await runner.fetchGame();
    await runner.fetchGame();
    await runner.fetchGame();
    await runner.fetchGame();
    game1Ref.runnerId = runner.runnerId;
    game2Ref.runnerId = runner.runnerId;
    game3Ref.runnerId = runner.runnerId;
    const gameRefs = await gameRepository.getGamesByPlayer('42');
    expect(gameRefs).toEqual([game1Ref, game2Ref, game3Ref]);
  });

  test('[streamPlayerGames] should stream games', async ({ gameRepository }) => {
    const runner1 = await PSQLGameRunnerMock.create();
    const runner2 = await PSQLGameRunnerMock.create();
    const game1 = await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }, { playerID: '21' }] });
    await runner1.fetchGame();
    const stream = await gameRepository.streamPlayerGames('42');

    const streamedGames = gameStreamToArray(stream, 3);
    
    const game2 = await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '22' }, { playerID: '42' }] });
    await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: 'Other' }] });
    const game3 = await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' },{ playerID: '23' }] });
    await runner2.fetchGame();
    await runner1.fetchGame();
    await runner1.fetchGame();
    await expect(streamedGames).resolves.toEqual([
      { gameId: game1.gameId, runnerId: runner1.runnerId },
      { gameId: game2.gameId, runnerId: runner2.runnerId },
      { gameId: game3.gameId, runnerId: runner1.runnerId },
    ]);
  });

  test('[streamPlayerGames] should stop listening player games only when all streams are read', async ({ gameRepository }) => {
    const gameParams = { gameDefId: 'foo', players: [{ playerID: '42' }] };
    const runner = await PSQLGameRunnerMock.create();
    const game1 = await gameRepository.addGame(gameParams);
    await runner.fetchGame();
    const stream1 = await gameRepository.streamPlayerGames('42');
    const stream2 = await gameRepository.streamPlayerGames('42');
    for await (const game of stream1) {
      break;
    }
    expect(gameRepository.isListeningOnPlayerGames('42')).toBeTruthy();
    for await (const game of stream2) {
      break;
    }
    expect(gameRepository.isListeningOnPlayerGames('42')).toBeFalsy();
  });

  test('[streamPlayerGames] should stream games independently from other streams for the same arena', async ({ gameRepository }) => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }] };
    const runner1 = await PSQLGameRunnerMock.create();

    let games: GameRef[] = [];
    async function addGame() {
      const game = await gameRepository.addGame(gameParams);
      games.push(game);
      await runner1.fetchGame();
    }

    setTimeout(async () => {
      await addGame();
      await addGame();
      await addGame();
    }, 100);
  
    const stream1 = await gameRepository.streamPlayerGames('42');
    const it1 = stream1[Symbol.asyncIterator]();
    const it1Game1 = (await it1.next()).value;
    const it1Game2 = (await it1.next()).value;
    const it1Game3 = (await it1.next()).value;

    await endGame(games[1].gameId);

    setTimeout(async () => {
      await addGame();
      await addGame();
    }, 100);

  
    const stream2 = await gameRepository.streamPlayerGames('42');
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

  test('[getArenaLatestGame] should retrieve latest game by arenaId', async ({ gameRepository, arena }) => {
    const runner = await PSQLGameRunnerMock.create();
    await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id });
    const latestGameRef = await  gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id });
    await runner.fetchGame();
    await runner.fetchGame();
    const gameRefPromise = gameRepository.getArenaLatestGame(arena.id);
    const { started_at } = await getGame(latestGameRef.gameId);
    await expect(gameRefPromise).resolves.toEqual({
      gameId: latestGameRef.gameId,
      runnerId: runner.runnerId,
      startedAt: started_at,
    });
  });

  test('[getArenaGameStream] should stream games', async ({ gameRepository, arena }) => {
    const runner1 = await PSQLGameRunnerMock.create();
    const runner2 = await PSQLGameRunnerMock.create();
    const game1 = await gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id });
    await runner1.fetchGame();
    const stream = await gameRepository.streamArenaGames(arena.id);

    const streamedGames = gameStreamToArray(stream, 3);
    
    const game2 = await  gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id });
    const game3 = await  gameRepository.addGame({gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id });
    await runner2.fetchGame();
    await runner1.fetchGame();
    await expect(streamedGames).resolves.toEqual([
      { gameId: game1.gameId, runnerId: runner1.runnerId },
      { gameId: game2.gameId, runnerId: runner2.runnerId },
      { gameId: game3.gameId, runnerId: runner1.runnerId },
    ]);
  });

  test('[getArenaGameStream] should stop listening arena games only when all streams are read', async ({ gameRepository, arena }) => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id };
    const runner = await PSQLGameRunnerMock.create();
    const game1 = await gameRepository.addGame(gameParams);
    await runner.fetchGame();
    const stream1 = await gameRepository.streamArenaGames(arena.id);
    const stream2 = await gameRepository.streamArenaGames(arena.id);
    for await (const game of stream1) {
      break;
    }
    expect(gameRepository.isListeningOnArenaGames(arena.id)).toBeTruthy();
    for await (const game of stream2) {
      break;
    }
    expect(gameRepository.isListeningOnArenaGames(arena.id)).toBeFalsy();
  });

  test('[getArenaGameStream] should stream games independently from other streams for the same arena', async ({ gameRepository, arena }) => {
    const gameParams = {gameDefId: 'foo', players: [{ playerID: '42' }], arenaId: arena.id };
    const runner1 = await PSQLGameRunnerMock.create();

    let games: GameRef[] = [];
    async function addGame() {
      const game = await gameRepository.addGame(gameParams);
      games.push(game);
      runner1.fetchGame();
    }

    setTimeout(async () => {
      await addGame();
      await addGame();
    }, 100);
  
    const stream1 = await gameRepository.streamArenaGames(arena.id);
    const it1 = stream1[Symbol.asyncIterator]();
    const it1Game1 = (await it1.next()).value;
    const it1Game2 = (await it1.next()).value;

    setTimeout(async () => {
      await addGame();
      await addGame();
    }, 100);
  
    const stream2 = await gameRepository.streamArenaGames(arena.id);
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
