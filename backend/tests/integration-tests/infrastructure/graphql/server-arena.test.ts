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
const teamMember2Data = { username: 'teamMember2', password: 'otherpass' };
const nonTeamMemberData = { username: 'nonTeamMember', password: 'otherpass' };

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

async function teamMemberFixture({ ctx, team }: Omit<TestFixtures, 'teamMember'>, use: any) {
  const teamMember = await ctx.providers.user.createUser(ctx, teamMemberData) as User;
  ctx.providers.team.addTeamMember(ctx, team.id, teamMember.id);
  await use(teamMember);
}

async function teamMember2Fixture({ ctx, team }: Omit<TestFixtures, 'teamMember2'>, use: any) {
  const teamMember = await ctx.providers.user.createUser(ctx, teamMember2Data) as User;
  ctx.providers.team.addTeamMember(ctx, team.id, teamMember.id);
  await use(teamMember);
}

async function nonTeamMemberFixture({ ctx }: Omit<TestFixtures, 'nonTeamMember'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: nonTeamMemberData.username,
    password: nonTeamMemberData.password,
  });
  await use(user);
}

interface TestFixtures {
  ctx: Context<any>,
  graphql: graphqlFixtureType,
  tournament: Tournament,
  team: Team,
  teamMember: User,
  teamMember2: User,
  nonTeamMember: User,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  teamMember: teamMemberFixture,
  teamMember2: teamMember2Fixture,
  nonTeamMember: nonTeamMemberFixture,
});

describe('graphql', () => {
  afterEach<TestFixtures>(async ({ ctx, graphql }) => {
    await graphql.server?.close();
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('Mutation/createArena', () => {
    const query = `
      mutation createArena($teamID: ID!, $name: String!) {
        createArena(teamID: $teamID, name: $name) {
          __typename
          ... on CreateArenaSuccess {
            arena {
              id
              name
            }
          }
          ... on CreateArenaFailure {
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
      const response = await graphql.client.query({ operationName: 'createArena', query: query, variables: {
        teamID: team.id, name: 'myArena'
      } });
      expect(response.body.data.createArena).eql(null);
      expect(response.body.errors[0].extensions.code).eql('UNAUTHENTICATED');
    });

    test('should fail if user is not part of a team', async ({ team, nonTeamMember, graphql }) => {
      await graphql.client.login(nonTeamMemberData);
      const response = await graphql.client.query({ operationName: 'createArena', query: query, variables: {
        teamID: team.id, name: 'myArena'
      } });
      expect(response.body.data.createArena.errors[0].__typename).eql('ForbiddenError');
    });

    test('should fail if name is invalid', async ({ team, teamMember, graphql }) => {
      await graphql.client.login(teamMemberData);
      const response = await graphql.client.query({ operationName: 'createArena', query: query, variables: {
        teamID: team.id, name: ''
      } });
      expect(response.body.data.createArena.errors[0].__typename).eql('ValidationError');
    });

    test('should fail if name is already taken', async ({ ctx, team, teamMember, teamMember2, graphql }) => {
      await ctx.providers.arena.createArena(ctx, { teamId: team.id, name: 'myArena' });
      await graphql.client.login(teamMemberData);
      const response = await graphql.client.query({ operationName: 'createArena', query: query, variables: {
        teamID: team.id, name: 'myArena'
      } });
      expect(response.body.data.createArena.errors[0].__typename).eql('ArenaNameAlreadyTakenError');
    });

    test('should fail if max number of arenas is reached', async ({ ctx, team, teamMember, graphql }) => {
      await ctx.providers.arena.createArena(ctx, { teamId: team.id, name: 'myArena' });
      await graphql.client.login(teamMemberData);
      const response = await graphql.client.query({ operationName: 'createArena', query: query, variables: {
        teamID: team.id, name: 'oneMore'
      } });
      expect(response.body.data.createArena.errors[0].__typename).eql('MaxArenaReachedError');
    });

    test('should succeed at creating an Arena', async ({ ctx, team, teamMember, graphql }) => {
      await graphql.client.login(teamMemberData);
      const response = await graphql.client.query({ operationName: 'createArena', query: query, variables: {
        teamID: team.id, name: 'newArena'
      } });
      expect(response.body.data.createArena.arena.name).eql('newArena');
      // expect(response.body.data.createArena.team.members[0].username).eql(user.username);
      const arena = await ctx.providers.arena.getArena(ctx, response.body.data.createArena.arena.id);
      expect(arena.name).eql(response.body.data.createArena.arena.name);
    });
  });
});
