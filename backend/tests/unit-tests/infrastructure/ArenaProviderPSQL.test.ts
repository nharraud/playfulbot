
import { afterEach, describe, expect, test as baseTest } from 'vitest';

import { dropTestDB } from '../../utils/psql';
import { Team } from '~playfulbot/core/entities/Teams';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { ArenaProviderPSQL } from '~playfulbot/infrastructure/providers/ArenaProviderPSQL';
import { Arena } from '~playfulbot/core/entities/Arena';
import { mockContextFixture } from '../../utils/fixtures';
import { ArenaNameAlreadyTakenError } from '~playfulbot/core/use-cases/interfaces/ArenaProvider';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';

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
    tournamentID: tournament.id
  });
  await use(team);
}

interface TestFixtures {
  ctx: ContextPSQL,
  tournament: Tournament,
  team: Team,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
});

describe('infrastructure/games/TeamProviderPSQL', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('createDebugArena', () => {
    test('should create a debugArena', async ({ ctx, team }) => {
      const provider = new ArenaProviderPSQL();
      const arena = await provider.createArena(ctx, {
        teamId: team.id,
        name: 'testArena'
      });
      expect(arena).toEqual({
        id: expect.any(String),
        teamId: team.id,
        name: 'testArena'
      });
    });

    test('should return an error if debugArena name exists', async ({ ctx, team }) => {
      const provider = new ArenaProviderPSQL();
      await provider.createArena(ctx, {
        teamId: team.id,
        name: 'testArena'
      });
      const arenaResponse = await provider.createArena(ctx, {
        teamId: team.id,
        name: 'testArena'
      });
      await expect(arenaResponse).instanceOf(ArenaNameAlreadyTakenError);
    });
  });

  describe('getDebugArena', () => {
    test('should get a debugArena', async ({ ctx, team }) => {
      const provider = new ArenaProviderPSQL();
      const createdArena = await provider.createArena(ctx, {
        teamId: team.id,
        name: 'testArena'
      }) as Arena;
      const retrievedArena = await provider.getArena(ctx, createdArena.id);
      expect(retrievedArena).toEqual(createdArena);
      expect(retrievedArena).toEqual({
        id: expect.any(String),
        teamId: team.id,
        name: 'testArena'
      });
    });
  });

  describe('countArenas', () => {
    test('should count arenas when there are arenas', async ({ ctx, team }) => {
      const provider = new ArenaProviderPSQL();
      const createdArena = await provider.createArena(ctx, {
        teamId: team.id,
        name: 'testArena'
      }) as Arena;
      const createdArena2 = await provider.createArena(ctx, {
        teamId: team.id,
        name: 'testArena2'
      }) as Arena;
      const arenasCount = await provider.countArenas(ctx, team.id);
      expect(arenasCount).toEqual(2);
    });

    test('should return 0 when there are no arenas', async ({ ctx, team }) => {
      const provider = new ArenaProviderPSQL();
      const arenasCount = await provider.countArenas(ctx, team.id);
      expect(arenasCount).toEqual(0);
    });

    test('should return 0 when the team does not exist', async ({ ctx, team }) => {
      const provider = new ArenaProviderPSQL();
      const arenasCount = await provider.countArenas(ctx, '00000000-0000-0000-0000-000000000000');
      expect(arenasCount).toEqual(0);
    });
  });
});
