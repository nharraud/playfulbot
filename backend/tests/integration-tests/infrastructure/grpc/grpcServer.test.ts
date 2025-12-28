import { afterEach, describe, expect, vi, test as baseTest } from 'vitest';
import * as grpcLib from '@grpc/grpc-js';

import { dropTestDB } from '../../../utils/psql';
import { grpcFixture, grpcFixtureType } from './fixtures/baseFixtures';
import { mockContextFixture } from 'tests/utils/fixtures';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { createPlayerToken } from 'playfulbot-backend-commons/lib/graphqlResolvers/authentication';
import { FollowPlayerGamesResponse } from '~playfulbot/infrastructure/grpc/proto/types/playfulbot_backend/v0/FollowPlayerGamesResponse';
import { randomUUID } from 'node:crypto';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { PSQLGameRunnerMock } from 'tests/utils/PSQLGameRunnerMock';
import { GameRef as GrpcGameRef } from '~playfulbot/infrastructure/grpc/proto/types/playfulbot_backend/v0/GameRef';
import { GameRef } from '~playfulbot/core/entities/GameRef';
import { range } from '~playfulbot/utils/arrays';
import { PlayerID } from '~playfulbot/core/entities/Players';


async function tournamentFixture({ ctx }: Omit<TestFixtures, 'tournament'>, use: any) {
  const tournament = await ctx.providers.tournament.createTournament(ctx, {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  });
  await use(tournament);
}

async function teamFixture({ ctx, tournament }: Omit<TestFixtures, 'team'>, use: any) {
  const team = await ctx.providers.team.createTeam(ctx, {
    name: 'testTeam',
    tournamentID: tournament.id,
  });
  await use(team);
}

async function gameRefFixture({ ctx, team }: Omit<TestFixtures, 'gameRef'>, use: any) {
  const gameRef = await ctx.providers.gameRepository.addGame({
    gameDefId: 'foo', players: [{ playerID: `T${team.id}_0` }]
  }) as GameRef;

  await use(gameRef);
}

interface TestFixtures {
  ctx: Context<any>,
  grpc: grpcFixtureType,
  tournament: Tournament,
  team: Team,
  gameRef: GameRef,
};

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  grpc: grpcFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  gameRef: gameRefFixture,
});

describe('grpc/grpcServer', () => {

  afterEach<TestFixtures>(async ({ ctx, grpc }) => {
    await grpc.server?.forceShutdown();
    await ctx.providers.gameRepository.close();
    await dropTestDB();
    vi.restoreAllMocks();
  });

  describe('Follow Player games requests', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    function followGames(grpc: grpcFixtureType, playerId: string, stopAfterNbGames: number = 1000) {
      const token = createPlayerToken(playerId);
      const authMetadata = new grpcLib.Metadata();
      authMetadata.set('authorization', token);

      return new Promise<GrpcGameRef[]>((resolve, reject) => {
        const gameIds = new Set();
        const result: GrpcGameRef[] = [];
        const playerGamesCall = grpc.client.FollowPlayerGames({}, authMetadata);
        playerGamesCall.on('data', (playerGamesResponse: FollowPlayerGamesResponse) => {
          for (const gameRef of playerGamesResponse.games) {
              // Because we create games very fast just at the moment we subscribe, the current games are sent twice.
              // That's fine. The client should support duplicate games being sent.
              // Here we remove duplicates
            if (!gameIds.has(gameRef.id)) {
              result.push(gameRef);
              gameIds.add(gameRef.id);
            }
            if (result.length >= stopAfterNbGames) {
              playerGamesCall.destroy()
            }
          }
        });
        playerGamesCall.on('error', (error) => {
          reject(error);
        });
        playerGamesCall.on('close', () => {
          resolve(result);
        })
      });
    }

    test('should return an error when the player does not match any existing team', async ({ grpc }) => {
      const playerId = `T${randomUUID()}_0`;
      const resPromise = followGames(grpc, playerId);
      await expect(resPromise).rejects.toThrowError(expect.objectContaining({ code: grpcLib.status.NOT_FOUND }));
    });

    test('should return an error when the player does not match any existing arena', async ({ grpc }) => {
      const playerId = `A${randomUUID()}_0`;
      const resPromise = followGames(grpc, playerId);
      await expect(resPromise).rejects.toThrowError(expect.objectContaining({ code: grpcLib.status.NOT_FOUND }));
    });

    test('should return an error when the player id does not match the expected format', async ({ grpc }) => {
      const playerId = 'unknown';
      const resPromise = followGames(grpc, playerId);
      await expect(resPromise).rejects.toThrowError(expect.objectContaining({ code: grpcLib.status.NOT_FOUND }));
    });

    async function createGames(ctx: Context<any>, playerId: PlayerID, nbGames: number, runner: PSQLGameRunnerMock) {
      const games = [];
      for (const _ of range(nbGames)) {
        const gameRef = await ctx.providers.gameRepository.addGame({
          gameDefId: 'foo', players: [{ playerID: playerId }]
        }) as GameRef;
        await runner.fetchGame();
        games.push(gameRef);
      }
      return games;
    }

    test('should stream games when there are no current games', async ({ ctx, grpc, team }) => {
      const playerId = `T${team.id}_0`;
      const resPromise = followGames(grpc, playerId, 3);

      const runner = await PSQLGameRunnerMock.create();
      const games = await createGames(ctx, playerId, 3, runner);

      const expectedGames: GrpcGameRef[] = games.map(gameRef => ({
        id: gameRef.gameId,
        url: runner.grpcUrl
      }));
      await expect(resPromise).resolves.toEqual(expectedGames);
    });


    test('should stream games when there are current games', async ({ ctx, grpc, team }) => {
      const playerId = `T${team.id}_0`;

      const runner = await PSQLGameRunnerMock.create();
      const currentGames = await createGames(ctx, playerId, 2, runner);

      const resPromise = followGames(grpc, playerId, 4);

      const newGames = await createGames(ctx, playerId, 2, runner);
      const allGames = [...currentGames, ...newGames];

      const expectedGames: GrpcGameRef[] = allGames.map(gameRef => ({
        id: gameRef.gameId,
        url: runner.grpcUrl
      }));
      const result = await resPromise;
      result.sort((a, b) => a.id.localeCompare(b.id));
      expectedGames.sort((a, b) => a.id.localeCompare(b.id));
      expect(result).toEqual(expectedGames);
    });
  });
});
