import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';

import { dropTestDB, initTestDB } from '../../utils/psql';
import { TournamentProviderPSQL } from '~playfulbot/infrastructure/providers/TournamentProviderPSQL';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { createMockContext } from '../../utils/context';
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

const test = baseTest.extend<TestFixtures>({
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
    test('should find tournament by Id', async ({ tournament }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getTournamentByID(createMockContext(), tournament.id);
      expect(foundTournament).toEqual(tournament);
    });

    test('should return null when no tournament is found', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getTournamentByID(createMockContext(), '8f926101-f99e-48cd-ba0e-cbfb256ccaf4');
      expect(foundTournament).toBeNull();
    });

    test('should return null error when the string is not an UUID', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.getTournamentByID(createMockContext(), 'unknown');
      expect(foundTournament).toBeNull();
    });
  });

  describe('exists', () => {
    test('should return true when tournament exists', async ({ tournament }) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.tournamentExists(createMockContext(), tournament.id);
      expect(foundTournament).toEqual(true);
    });

    test('should return falsde when tournament does not exist', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = await provider.tournamentExists(createMockContext(), '8f926101-f99e-48cd-ba0e-cbfb256ccaf4');
      expect(foundTournament).toEqual(false);
    });

    test('should throw InvalidArgument error when the string is not an UUID', async ({}) => {
      const provider = new TournamentProviderPSQL();
      const foundTournament = provider.tournamentExists(createMockContext(), 'unknown');
      await expect(foundTournament).rejects.toThrowError(InvalidArgument);
    });
  });
});
