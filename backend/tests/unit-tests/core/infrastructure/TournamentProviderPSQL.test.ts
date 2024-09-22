import { beforeEach, afterEach, describe, expect, test } from 'vitest';

import { dropTestDB, initTestDB } from './utils/psql';
import { TournamentProviderPSQL } from '~playfulbot/infrastructure/TournamentProviderPSQL';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { createMockContext } from './utils/context';
import { InvalidArgument } from '~playfulbot/core/use-cases/Errors';

async function tournamentFixture({}, use: any) {
  const provider = new TournamentProviderPSQL();
  const tournament = await provider.createTournament(createMockContext(), {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  });
  await use(tournament);
}

interface TestFixtures {
  tournament: Tournament,
}

const ctest = test.extend<TestFixtures>({
  tournament: tournamentFixture,
});

describe('infrastructure/games/TournamentProviderPLSQL', () => {
  beforeEach(async () => {
    await initTestDB();
  });

  afterEach(async () => {
    await dropTestDB();
  });

  describe('createTournament', () => {
    test('should create tournament', async () => {
      const provider = new TournamentProviderPSQL();
      const tournament = await provider.createTournament(createMockContext(), {
        name: 'testTournament',
        gameDefinitionId: 'testGame',
        lastRoundDate: '2024-01-02T00:00:00+00',
        minutesBetweenRounds: 60,
        roundsNumber: 10,
        startDate: '2024-01-01T00:00:00+00',
      });
      expect({ a: tournament.id }).toEqual({ a: expect.any(String) });
      expect(tournament).toMatchObject({
        id: expect.any(String),
        name: 'testTournament',
        gameDefinitionId: 'testGame',
        lastRoundDate: '2024-01-02T00:00:00+00',
        minutesBetweenRounds: 60,
        roundsNumber: 10,
        startDate: '2024-01-01T00:00:00+00',
        status: "CREATED",
      });
    });
  });

  describe('getById', () => {
    ctest('should find tournament by Id', async ({ tournament }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getByID(createMockContext(), tournament.id);
      expect(foundTournament).toEqual(tournament);
    });

    ctest('should return null when no tournament is found', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getByID(createMockContext(), '8f926101-f99e-48cd-ba0e-cbfb256ccaf4');
      expect(foundTournament).toBeNull();
    });

    ctest('should throw InvalidArgument error when the string is not an UUID', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = provider.getByID(createMockContext(), 'unknown');
      await expect(foundTournament).rejects.toThrowError(InvalidArgument);
    });
  });

  describe('exists', () => {
    ctest('should return true when tournament exists', async ({ tournament }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.exists(createMockContext(), tournament.id);
      expect(foundTournament).toEqual(true);
    });

    ctest('should return falsde when tournament does not exist', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.exists(createMockContext(), '8f926101-f99e-48cd-ba0e-cbfb256ccaf4');
      expect(foundTournament).toEqual(false);
    });

    ctest('should throw InvalidArgument error when the string is not an UUID', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = provider.exists(createMockContext(), 'unknown');
      await expect(foundTournament).rejects.toThrowError(InvalidArgument);
    });
  });
});
