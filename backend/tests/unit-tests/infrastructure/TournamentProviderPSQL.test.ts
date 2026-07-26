import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';

import { dropTestDB, initTestDB } from '../../utils/psql';
import { TournamentProviderPSQL } from '~playfulbot/infrastructure/providers/TournamentProviderPSQL';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { createMockContext } from '../../utils/context';
import { InvalidArgument } from '~playfulbot/core/use-cases/Errors';
import { mockContextFixture } from 'tests/utils/fixtures';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';
import { User } from '~playfulbot/core/entities/Users';
import { TournamentRole } from '~playfulbot/core/entities/TournamentRole';

const tournamentParams = {
  name: 'testTournament',
  gameDefinitionId: 'testGame',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-02T00:00:00Z',
  config: {},
};

async function tournamentsFixture({ ctx }: Omit<TestFixtures, 'tournaments'>, use: any) {
  const provider = new TournamentProviderPSQL();
  const tournaments = [];
  for (let i = 0; i < 3; ++i) {
    const tournament = await provider.createTournament(ctx, { ...tournamentParams, name: `${tournamentParams.name}${i}` });
    tournaments.push(tournament);
  }
  await use(tournaments);
}

async function userFixture({ ctx }: Omit<TestFixtures, 'user'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

interface TestFixtures {
  ctx: ContextPSQL,
  tournaments: Tournament[],
  user: User,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournaments: tournamentsFixture,
  user: userFixture,
});

describe('infrastructure/games/TournamentProviderPLSQL', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('createTournament', () => {
    test('should create tournament', async ({ ctx }) => {
      const provider = new TournamentProviderPSQL();
      const tournament = await provider.createTournament(ctx, {
        name: 'testTournament',
        gameDefinitionId: 'testGame',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-02T00:00:00Z',
        config: {},
      });
      expect({ a: tournament.id }).toEqual({ a: expect.any(String) });
      expect(tournament).toMatchObject({
        id: expect.any(String),
        name: 'testTournament',
        gameDefinitionId: 'testGame',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-02T00:00:00Z',
        config: {},
        status: "CREATED",
      });
    });
  });

  describe('getById', () => {
    test('should find tournament by Id', async ({ ctx, tournaments }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getTournamentByID(ctx, tournaments[0].id);
      expect(foundTournament).toEqual(tournaments[0]);
    });

    test('should return null when no tournament is found', async ({ ctx }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getTournamentByID(ctx, '8f926101-f99e-48cd-ba0e-cbfb256ccaf4');
      expect(foundTournament).toBeNull();
    });

    test('should return null error when the string is not an UUID', async ({ ctx }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getTournamentByID(ctx, 'unknown');
      expect(foundTournament).toBeNull();
    });
  });

  describe('exists', () => {
    test('should return true when tournament exists', async ({ ctx, tournaments }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.tournamentExists(ctx, tournaments[0].id);
      expect(foundTournament).toEqual(true);
    });

    test('should return false when tournament does not exist', async ({ ctx }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.tournamentExists(ctx, '8f926101-f99e-48cd-ba0e-cbfb256ccaf4');
      expect(foundTournament).toEqual(false);
    });

    test('should throw InvalidArgument error when the string is not an UUID', async ({ ctx }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = provider.tournamentExists(ctx, 'unknown');
      await expect(foundTournament).rejects.toThrowError(InvalidArgument);
    });
  });

  describe('changeTournamentRole', () => {
    test('should add user role', async ({ ctx, tournaments, user }) => {
      const provider = new TournamentProviderPSQL();
      await provider.changeTournamentRole(ctx, {
        tournamentId: tournaments[0].id,
        userId: user.id,
        role: TournamentRole.Organizer,
      });
      const role = await provider.getUserRole(ctx, { userId: user.id, tournamentId: tournaments[0].id });
      expect(role).toEqual(TournamentRole.Organizer);
    });

    test('should remove user role', async ({ ctx, tournaments, user }) => {
      const provider = new TournamentProviderPSQL();
      await provider.changeTournamentRole(ctx, {
        tournamentId: tournaments[0].id,
        userId: user.id,
        role: TournamentRole.Organizer,
      });
      const role1 = await provider.getUserRole(ctx, { userId: user.id, tournamentId: tournaments[0].id });

      expect(role1).toEqual(TournamentRole.Organizer);
      await provider.changeTournamentRole(ctx, {
        tournamentId: tournaments[0].id,
        userId: user.id,
        role: null,
      });
      const role2 = await provider.getUserRole(ctx, { userId: user.id, tournamentId: tournaments[0].id });
      expect(role2).toEqual(null);
    });

    // There are no other role than ORGANIZER for now so we can't test role change
  });

  describe('getAllTournaments', () => {
    test('should return all tournaments when there are no filters', async ({ ctx, tournaments, user }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournaments = await provider.getAllTournaments(ctx);
      expect(foundTournaments).toEqual(tournaments);
    });

    test('should limit returned tournaments', async ({ ctx, tournaments, user }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournaments = await provider.getAllTournaments(ctx, { limit: 2 });
      expect(foundTournaments).toEqual([ tournaments[0], tournaments[1] ]);
    });

    test('should offset returned tournaments', async ({ ctx, tournaments, user }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournaments = await provider.getAllTournaments(ctx, { offset: 1 });
      expect(foundTournaments).toEqual([ tournaments[1], tournaments[2] ]);
    });

    test('should filter tournaments by role', async ({ ctx, tournaments, user }) => {
      const provider = new TournamentProviderPSQL();
      await provider.changeTournamentRole(ctx, { tournamentId: tournaments[0].id, userId: user.id, role: TournamentRole.Organizer });
      await provider.changeTournamentRole(ctx, { tournamentId: tournaments[2].id, userId: user.id, role: TournamentRole.Organizer });
      const foundTournaments = await provider.getAllTournaments(ctx,
        { filters: { userRole: { role: TournamentRole.Organizer, userId: user.id } } }
      );

      expect(foundTournaments).toEqual([ tournaments[0], tournaments[2] ]);
    });
  });
});
