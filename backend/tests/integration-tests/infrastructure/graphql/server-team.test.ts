import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createMockContext } from '../../../utils/context';
import { dropTestDB } from '../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { graphqlFixture, graphqlFixtureType, mockContextFixture } from './fixtures.ts/baseFixtures';
import { Tournament, TournamentID } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { hideErrorLogs } from './utils/logger';

const userData = { username: 'testuser', password: 'testpassword' };


async function tournamentFixture({ ctx }: { ctx: Context<any> }, use: any) {
  const tournament = await ctx.providers.tournament.createTournament(createMockContext(), {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  });
  await use(tournament);
}

async function teamFixture({ ctx, tournament }: { ctx: Context<any>, tournament: Tournament }, use: any) {
  const team = await ctx.providers.team.createTeam(createMockContext(), {
    name: 'testTeam',
    tournamentID: tournament.id,
  });
  await use(team);
}

async function userFixture({ ctx }: { ctx: Context<any> }, use: any) {
  const user = await ctx.providers.user.createUser(createMockContext(), userData);
  await use(user);
}

interface TestFixtures {
  ctx: Context<any>,
  graphql: graphqlFixtureType,
  tournament: Tournament,
  team: Team,
  user: User,
}

const ctest = test.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  user: userFixture,
});

describe('graphql', () => {
  afterEach<TestFixtures>(async ({ graphql }) => {
    await graphql.server?.close();
    await dropTestDB();
  });

  describe('Query/team', () => {
    const query = `
      query GetTeam($userID: ID!, $tournamentID: ID!) {
        team(userID: $userID, tournamentID: $tournamentID) {
          ... on Team {
            id
            name
            members {
              id
              username
            }
          }
          ... on UserNotPartOfAnyTeam {
            message
          }
        }
      }`;

    ctest('should fail if user is not authenticated', async ({ tournament, user, graphql }) => {
      hideErrorLogs();
      const response = await graphql.client.query({ operationName: 'GetTeam', query: query, variables: { userID: user.id, tournamentID: tournament.id } });
      expect(response.body.data.team).eql(null);
      expect(response.body.errors[0].extensions.code).eql('FORBIDDEN');
    });

    ctest('should return current user team if user is in a team', async ({ ctx, user, team, tournament, graphql }) => {
      ctx.providers.team.addTeamMember(ctx, team.id, user.id);
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'GetTeam', query: query, variables: { userID: user.id, tournamentID: tournament.id } });
      expect(response.body.data.team.name).eql(team.name);
    });

    ctest('should return UserNotPartOfAnyTeam message if the user is not part of any team', async ({ user, tournament, graphql }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'GetTeam', query: query, variables: { userID: user.id, tournamentID: tournament.id } });
      expect(response.body.data.team.message).eql('User is not part of any team in this tournament');
    });
  });
});
