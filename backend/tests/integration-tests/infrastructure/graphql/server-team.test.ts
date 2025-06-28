import { afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB } from '../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { graphqlFixture, graphqlFixtureType } from './fixtures/baseFixtures';
import { mockContextFixture } from '../../../utils/fixtures';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { hideErrorLogs } from './utils/logger';

const userData = { username: 'testuser', password: 'testpassword' };
const teamMemberData = { username: 'teamMember', password: 'otherpass' };
const team2Member1Data = { username: 'team2Member1', password: 'otherpass' };
const team2Member2Data = { username: 'team2Member2', password: 'otherpass' };

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

async function team2Fixture({ ctx, tournament }: { ctx: Context<any>, tournament: Tournament }, use: any) {
  const team = await ctx.providers.team.createTeam(ctx, {
    name: 'testTeam2',
    tournamentID: tournament.id,
  });
  await use(team);
}

async function teamMemberFixture({ ctx, team }: { ctx: Context<any>, team: Team }, use: any) {
  const teamMember = await ctx.providers.user.createUser(ctx, teamMemberData) as User;
  ctx.providers.team.addTeamMember(ctx, team.id, teamMember.id);
  await use(teamMember);
}

async function team2MembersFixture({ ctx, team2 }: { ctx: Context<any>, team2: Team }, use: any) {
  const teamMembers = await Promise.all([
    ctx.providers.user.createUser(ctx, team2Member1Data) as Promise<User>,
    ctx.providers.user.createUser(ctx, team2Member2Data) as Promise<User>,
  ]);
  ctx.providers.team.addTeamMember(ctx, team2.id, teamMembers[0].id);
  ctx.providers.team.addTeamMember(ctx, team2.id, teamMembers[1].id);
  await use(teamMembers);
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
  team2: Team,
  teamMember: User,
  team2Members: User[],
  user: User,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  team2: team2Fixture,
  teamMember: teamMemberFixture,
  team2Members: team2MembersFixture,
  user: userFixture,
});

describe('graphql', () => {
  afterEach<TestFixtures>(async ({ ctx, graphql }) => {
    await graphql.server?.close();
    await ctx.providers.gameRepository.close();
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

    test('should fail if name is already taken', async ({ ctx, tournament, user, graphql, team }) => {
      await graphql.client.login(userData);
      await ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, { tournamentId: tournament.id, userId: user.id });
      const response = await graphql.client.query({ operationName: 'createTeam', query: query, variables: {
        tournamentID: tournament.id, input: { name: team.name }, join: true
      } });
      expect(response.body.data.createTeam.errors[0].__typename).eql('TeamNameAlreadyTakenError');
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
      const userteam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
      expect(userteam.id).eql(response.body.data.createTeam.team.id);
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

    test('should fail if name is already taken', async ({ ctx, team, team2, teamMember, graphql }) => {
      await graphql.client.login(teamMemberData);

      const response = await graphql.client.query({ operationName: 'updateTeam', query: query, variables: {
        teamID: team.id, input: { name: team2.name }
      } });
      expect(response.body.data.updateTeam.errors[0].__typename).eql('TeamNameAlreadyTakenError');
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


  describe('Mutation/joinTeam', () => {
    const query = `
    mutation joinTeam($teamID: ID!) {
      joinTeam(teamID: $teamID) {
        __typename
        ... on JoinTeamSuccess {
          oldTeam {
            __typename
            ... on Team {
              id
              name
              members {
                id
                username
              }
            }
            ... on DeletedTeam {
              id
              name
            }
          }
          newTeam {
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
        ... on JoinTeamFailure {
          errors {
            ... on Error {
              __typename
              message
            }
          }
        }
      }
    }`;

    test('should fail if user is not authenticated', async ({ team, teamMember, graphql }) => {
      hideErrorLogs();
      const response = await graphql.client.query({ operationName: 'joinTeam', query, variables: {
        teamID: team.id
      } });
      expect(response.body.data.joinTeam).eql(null);
      expect(response.body.errors[0].extensions.code).eql('UNAUTHENTICATED');
    });

    test('should fail if user is not invited and is not part of any team', async ({ user, team, teamMember, graphql }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'joinTeam', query, variables: {
        teamID: team.id
      } });
      expect(response.body.data.joinTeam.errors[0].__typename).eql('ForbiddenError');
    });

    test('should succeed at joining a team if invited to tournament and has no team', async ({ ctx, tournament, user, team, teamMember, graphql }) => {
      await graphql.client.login(userData);
      await ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, { tournamentId: tournament.id, userId: user.id });
      const response = await graphql.client.query({ operationName: 'joinTeam', query, variables: {
        teamID: team.id
      } });
      expect(response.body.data.joinTeam.newTeam.name).eql(team.name);
      expect(response.body.data.joinTeam.newTeam.members).toHaveLength(2);
      expect(response.body.data.joinTeam.newTeam.members).toContainEqual({ id: teamMember.id, username: teamMember.username });
      expect(response.body.data.joinTeam.newTeam.members).toContainEqual({ id: user.id, username: user.username });
      expect(response.body.data.joinTeam.oldTeam).toBeNull();
      const userteam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
      expect(userteam.id).eql(response.body.data.joinTeam.newTeam.id);
    });

    test('should succeed at joining a team if already in another team having other members', async ({ ctx, tournament, team, teamMember, team2, team2Members, graphql }) => {
      await graphql.client.login(team2Member1Data);
      const response = await graphql.client.query({ operationName: 'joinTeam', query, variables: {
        teamID: team.id
      } });
      expect(response.body.data.joinTeam.newTeam.name).eql(team.name);
      expect(response.body.data.joinTeam.newTeam.members).toHaveLength(2);
      expect(response.body.data.joinTeam.newTeam.members).toContainEqual({ id: teamMember.id, username: teamMember.username });
      expect(response.body.data.joinTeam.newTeam.members).toContainEqual({ id: team2Members[0].id, username: team2Members[0].username });
      expect(response.body.data.joinTeam.oldTeam).toMatchObject({ __typename: 'Team', id: team2.id, name: team2.name });
      expect(response.body.data.joinTeam.oldTeam.members).eql([{ id: team2Members[1].id, username: team2Members[1].username }]);
      const userteam = await ctx.providers.team.getTeamByMember(ctx, team2Members[0].id, tournament.id);
      expect(userteam.id).eql(response.body.data.joinTeam.newTeam.id);
    });

    test('should succeed at joining a team if already in another team having NO other members', async ({ ctx, tournament, team, teamMember, team2, team2Members, graphql }) => {
      await graphql.client.login(teamMemberData);
      const response = await graphql.client.query({ operationName: 'joinTeam', query, variables: {
        teamID: team2.id
      } });
      expect(response.body.data.joinTeam.newTeam.name).eql(team2.name);
      expect(response.body.data.joinTeam.newTeam.members).toHaveLength(3);
      expect(response.body.data.joinTeam.newTeam.members).toContainEqual({ id: teamMember.id, username: teamMember.username });
      expect(response.body.data.joinTeam.newTeam.members).toContainEqual({ id: team2Members[0].id, username: team2Members[0].username });
      expect(response.body.data.joinTeam.newTeam.members).toContainEqual({ id: team2Members[1].id, username: team2Members[1].username });
      expect(response.body.data.joinTeam.oldTeam).toMatchObject({ __typename: 'DeletedTeam', id: team.id, name: team.name });
      const userteam = await ctx.providers.team.getTeamByMember(ctx, teamMember.id, tournament.id);
      expect(userteam.id).eql(response.body.data.joinTeam.newTeam.id);
    });
  });
});
