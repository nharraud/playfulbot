import { afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB } from '../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { graphqlFixture, graphqlFixtureType, mockContextFixture } from './fixtures.ts/baseFixtures';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { hideErrorLogs } from './utils/logger';

const userData = { username: 'testuser', password: 'testpassword' };
const teamMemberData = { username: 'teamMember', password: 'otherpass' };

async function tournamentFixture({ ctx }: { ctx: Context<any> }, use: any) {
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

async function teamFixture({ ctx, tournament }: { ctx: Context<any>, tournament: Tournament }, use: any) {
  const team = await ctx.providers.team.createTeam(ctx, {
    name: 'testTeam',
    tournamentID: tournament.id,
  });
  await use(team);
}

async function teamMemberFixture({ ctx, team }: { ctx: Context<any>, team: Team }, use: any) {
  const teamMember = await ctx.providers.user.createUser(ctx, teamMemberData) as User;
  ctx.providers.team.addTeamMember(ctx, team.id, teamMember.id);
  await use(teamMember);
}

async function userFixture({ ctx }: { ctx: Context<any> }, use: any) {
  const user = await ctx.providers.user.createUser(ctx, userData);
  await use(user);
}

interface TestFixtures {
  ctx: Context<any>,
  graphql: graphqlFixtureType,
  tournament: Tournament,
  team: Team,
  teamMember: User,
  user: User,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  teamMember: teamMemberFixture,
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
          __typename
          ... on Team {
            id
            name
            members {
              id
              username
            }
            tournament {
              id
            }
          }
          ... on UserNotPartOfAnyTeam {
            message
          }
        }
      }`;

    test('should fail if user is not authenticated', async ({ tournament, user, graphql }) => {
      hideErrorLogs();
      const response = await graphql.client.query({ operationName: 'GetTeam', query: query, variables: { userID: user.id, tournamentID: tournament.id } });
      expect(response.body.data.team).eql(null);
      expect(response.body.errors[0].extensions.code).eql('UNAUTHENTICATED');
    });

    test('should return current user team if user is in a team', async ({ ctx, user, team, teamMember, tournament, graphql }) => {
      ctx.providers.team.addTeamMember(ctx, team.id, user.id);
      await graphql.client.login(userData);

      const response = await graphql.client.query({ operationName: 'GetTeam', query: query, variables: { userID: user.id, tournamentID: tournament.id } });

      expect(response.body.data.team.id).eql(team.id);
      expect(response.body.data.team.name).eql(team.name);

      response.body.data.team.members.sort((a: { username: string }, b: { username: string}) => a.username.localeCompare(b.username));
      expect(response.body.data.team.members).eql([
        { username: teamMember.username, id: teamMember.id },
        { username: user.username, id: user.id },
      ]);
      expect(response.body.data.team.tournament.id).eql(tournament.id);
    });

    test('should return UserNotPartOfAnyTeam message if the user is not part of any team', async ({ user, tournament, graphql }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'GetTeam', query: query, variables: { userID: user.id, tournamentID: tournament.id } });
      expect(response.body.data.team.message).eql('User is not part of any team in this tournament');
      expect(response.body.data.team.__typename).eql('UserNotPartOfAnyTeam');
    });
  });


  describe('Mutation/createTeam', () => {
    const query = `
      mutation createTeam($input: TeamInput!, $tournamentID: ID!, $join: Boolean!) {
        createTeam(tournamentID: $tournamentID, input: $input, join: $join) {
          __typename
          ... on CreateTeamSuccess {
            team {
              id
              name
              members {
                id
                username
              }
              tournament {
                id
              }
            }
          }
          ... on CreateTeamFailure {
            errors {
              ... on Error {
                __typename
                message
              }
            }
          }
        }
      }`;

    test('should fail if user is not authenticated', async ({ tournament, user, graphql }) => {
      hideErrorLogs();
      const response = await graphql.client.query({ operationName: 'createTeam', query: query, variables: {
        tournamentID: tournament.id, input: { name: 'newTeam' }, join: true
      } });
      expect(response.body.data.createTeam).eql(null);
      expect(response.body.errors[0].extensions.code).eql('UNAUTHENTICATED');
    });

    test('should fail if name is invalid', async ({ ctx, tournament, user, graphql }) => {
      await graphql.client.login(userData);
      await ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, { tournamentId: tournament.id, userId: user.id });
      const response = await graphql.client.query({ operationName: 'createTeam', query: query, variables: {
        tournamentID: tournament.id, input: { name: 'n' }, join: true
      } });
      expect(response.body.data.createTeam.errors[0].__typename).eql('ValidationError');
    });

    test('should fail if user is not invited and is not part of any team', async ({ ctx, tournament, user, graphql }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'createTeam', query: query, variables: {
        tournamentID: tournament.id, input: { name: 'newTeam' }, join: true
      } });
      expect(response.body.data.createTeam.errors[0].__typename).eql('ForbiddenError');
    });

    test('should succeed at creating a team if invited to tournament', async ({ ctx, tournament, user, graphql }) => {
      await graphql.client.login(userData);
      await ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, { tournamentId: tournament.id, userId: user.id });
      const response = await graphql.client.query({ operationName: 'createTeam', query: query, variables: {
        tournamentID: tournament.id, input: { name: 'newTeam' }, join: true
      } });
      expect(response.body.data.createTeam.team.name).eql('newTeam');
      expect(response.body.data.createTeam.team.members[0].username).eql(user.username);
      const team = await ctx.providers.team.getTeamByID(ctx, response.body.data.createTeam.team.id);
      expect(team.name).eql(response.body.data.createTeam.team.name);
    });
  });


  describe('Mutation/updateTeam', () => {
    const query = `
      mutation updateTeam($teamID: ID!, $input: TeamInput!) {
        updateTeam(teamID: $teamID, input: $input) {
          __typename
          ... on UpdateTeamSuccess {
            team {
              id
              name
              members {
                id
                username
              }
              tournament {
                id
              }
            }
          }
          ... on UpdateTeamFailure {
            errors {
              ... on Error {
                __typename
                message
              }
            }
          }
        }
      }`;

    test('should fail if user is not authenticated', async ({ team, graphql }) => {
      hideErrorLogs();
      const response = await graphql.client.query({ operationName: 'updateTeam', query: query, variables: {
        teamID: team.id, input: { name: 'newTeam' }
      } });
      expect(response.body.data.updateTeam).eql(null);
      expect(response.body.errors[0].extensions.code).eql('UNAUTHENTICATED');
    });

    test('should fail if name is invalid', async ({ ctx, team, teamMember, graphql }) => {
      await graphql.client.login(teamMemberData);

      const response = await graphql.client.query({ operationName: 'updateTeam', query: query, variables: {
        teamID: team.id, input: { name: 'n' }
      } });
      expect(response.body.data.updateTeam.errors[0].__typename).eql('ValidationError');
    });

    test('should succeed at updating a team', async ({ ctx, team, teamMember, graphql }) => {
      await graphql.client.login(teamMemberData);
      const response = await graphql.client.query({ operationName: 'updateTeam', query: query, variables: {
        teamID: team.id, input: { name: 'newTeam' }
      } });
      expect(response.body.data.updateTeam.team.name).eql('newTeam')
      const updatedTeam = await ctx.providers.team.getTeamByID(ctx, team.id);
      expect(updatedTeam.name).eql('newTeam');
    });
  });
});
