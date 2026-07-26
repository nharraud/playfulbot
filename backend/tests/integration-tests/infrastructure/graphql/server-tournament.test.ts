import { afterEach, beforeEach, describe, expect, test as baseTest, vi } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { dropTestDB } from '../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { graphqlFixture, graphqlFixtureType } from './fixtures/baseFixtures';
import { mockContextFixture } from '../../../utils/fixtures';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { User } from '~playfulbot/core/entities/Users';

const userData = { username: 'testuser', password: 'testpassword' };

async function tournamentFixture({ ctx }: { ctx: Context<any> }, use: any) {
  const tournament = await ctx.providers.tournament.createTournament(ctx, {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    startDate: '2024-01-01T00:00:00+00',
    endDate: '2024-01-02T00:00:00+00',
  });
  await use(tournament);
}

async function userFixture({ ctx }: { ctx: Context<any> }, use: any) {
  const user = await ctx.providers.user.createUser(ctx, userData);
  await use(user);
}

interface TestFixtures {
  ctx: Context<any>,
  graphql: graphqlFixtureType,
  tournament: Tournament,
  user: User,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
  tournament: tournamentFixture,
  user: userFixture,
});

describe('graphql', () => {
  afterEach<TestFixtures>(async ({ ctx, graphql }) => {
    await graphql.server?.close();
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('Query/tournament', () => {
    const query = `query tournament($tournamentID: ID!) {
      tournament(tournamentID: $tournamentID) {
        id, name
      }
    }`;

    test('should fail if tournament is not authenticated', async ({ graphql, tournament }) => {
      const response = await graphql.client.query({ operationName: 'tournament', query, variables: { tournamentID: tournament.id } });
      expect(response.body.data.tournament).eql(null);
      expect(response.body.errors[0].extensions.code).eql('FORBIDDEN');
    });

    test('should return NOT_FOUND if tournament id is not a UUID', async ({ graphql, user }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'tournament', query, variables: { tournamentID: 'astring' } });
      expect(response.body.data.tournament).toBeNull();
      expect(JSON.stringify(response.body.errors[0].extensions.code)).toEqual('"NOT_FOUND"');
    });

    test('should return NOT_FOUND if tournament does not exist', async ({ graphql, user }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'tournament', query, variables: { tournamentID: uuidv4() } });
      expect(response.body.data.tournament).toBeNull();
      expect(JSON.stringify(response.body.errors[0].extensions.code)).toEqual('"NOT_FOUND"');
    });

    test('should return tournament', async ({ graphql, user, tournament }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'tournament', query, variables: { tournamentID: tournament.id } });
      expect(response.body.data.tournament).eql({
        id: tournament.id,
        name: tournament.name,
      });
    });
  });

  describe('Mutation/createTournament', () => {
    const tournamentData = {
      name: 'newTournament',
      gameDefinitionId: 'testGame',
      startDate: '3024-01-01T00:00:00Z',
      endDate: '3024-01-02T00:00:00Z',
    };
    const query = `mutation createTournament(
      $name: String!,
      $startDate: Date!,
      $endDate: Date!,
    ) {
      createTournament(
        name: $name
        startDate: $startDate,
        endDate: $endDate,
      ) {
        id
        name
      }
    }`;

    test('should fail if tournament is not authenticated', async ({ graphql, tournament }) => {
      const response = await graphql.client.query({ operationName: 'createTournament', query, variables: tournamentData });
      expect(response.body.data.createTournament).eql(null);
      expect(response.body.errors[0].extensions.code).eql('FORBIDDEN');
    });

    test('should create tournament', async ({ ctx, graphql, user }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'createTournament', query, variables: tournamentData });
      const createdTournament = await ctx.providers.tournament.getTournamentByID(ctx, response.body.data.createTournament.id);
      expect(response.body.data.createTournament).eql({
        id: createdTournament.id,
        name: createdTournament.name,
      });
      expect(createdTournament.name).toEqual(tournamentData.name);
    });
  });
});
