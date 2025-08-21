import { afterEach, beforeEach, describe, expect, test as baseTest, vi } from 'vitest';
import { dropTestDB } from '../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { graphqlFixture, graphqlFixtureType } from './fixtures/baseFixtures';
import { mockContextFixture } from '../../../utils/fixtures';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { User } from '~playfulbot/core/entities/Users';
import { Team } from '~playfulbot/core/entities/Teams';
import { TournamentInvitation } from '~playfulbot/core/entities/TournamentInvitation';
import { range } from '~playfulbot/utils/arrays';
import { TournamentRole } from '~playfulbot/core/entities/TournamentRole';

const userData = { username: 'testuser', password: 'testpassword' };
const user2Data = { username: 'testuser2', password: 'testpassword' };

interface TestFixtures {
  ctx: Context<any>,
  graphql: graphqlFixtureType,
  tournaments: Tournament[],
  tournamentInvitations: TournamentInvitation[],
  teams: Team[],
  user: User,
  user2: User,
}

async function userFixture({ ctx }: Omit<TestFixtures, 'user'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, userData);
  await use(user);
}

async function user2Fixture({ ctx }: Omit<TestFixtures, 'user2'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, user2Data);
  await use(user);
}

const tournamentData = {
  gameDefinitionId: 'testGame',
  lastRoundDate: '2024-01-02T00:00:00+00',
  minutesBetweenRounds: 60,
  roundsNumber: 10,
  startDate: '2024-01-01T00:00:00+00',
};

async function tournamentsFixture({ ctx }: Omit<TestFixtures, 'tournaments'>, use: any) {
  use(Promise.all<Tournament>(range(4).map(index => 
    ctx.providers.tournament.createTournament(ctx, { ...tournamentData, name: `testTournament${index}` })
  )));
}

async function tournamentInvitationsFixture({ ctx, user, tournaments }: Omit<TestFixtures, 'tournamentInvitations'>, use: any) {
  const invitation0 = await ctx.providers.tournamentInvitation.createTournamentInvitation(
    ctx, { tournamentId: tournaments[2].id, inviteeId: user.id }
  );
  const invitation1 = await ctx.providers.tournamentInvitation.createTournamentInvitation(
    ctx, { tournamentId: tournaments[3].id, inviteeId: user.id }
  );
  await use([ invitation0, invitation1 ]);
}

async function teamsFixture({ ctx, tournaments, user }: Omit<TestFixtures, 'teams'>, use: any) {
  const team0 = await ctx.providers.team.createTeam(ctx, { tournamentID: tournaments[0].id, name: 'team0' }) as Team;
  const team1 = await ctx.providers.team.createTeam(ctx, { tournamentID: tournaments[1].id, name: 'team1' }) as Team;
  const team2 = await ctx.providers.team.createTeam(ctx, { tournamentID: tournaments[2].id, name: 'team2' }) as Team;
  await ctx.providers.team.addTeamMember(ctx, team0.id, user.id);
  await ctx.providers.team.addTeamMember(ctx, team1.id, user.id);
  await use([team0, team1, team2]);
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
  tournaments: tournamentsFixture,
  tournamentInvitations: tournamentInvitationsFixture,
  teams: teamsFixture,
  user: userFixture,
  user2: user2Fixture,
});

describe('graphql', () => {
  afterEach<TestFixtures>(async ({ ctx, graphql }) => {
    await graphql.server?.close();
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('Query/authenticatedUser', () => {
    test('should fail if user is not authenticated', async ({ graphql, user }) => {
      const response = await graphql.client.query({ operationName: 'authenticatedUser', query: 'query authenticatedUser { authenticatedUser { username }}' });
      expect(response.body.data.authenticatedUser).eql(null);
      expect(response.body.errors[0].extensions.code).eql('FORBIDDEN');
    });

    test('should return current user', async ({ graphql, user }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'authenticatedUser', query: 'query authenticatedUser { authenticatedUser { username }}' });
      expect(response.body.data.authenticatedUser.username).eql(user.username);
    });
  });
  

  describe('Query/User.teams', () => {
    test('should return user teams', async ({ graphql, user, teams }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'authenticatedUser', query: `
        query authenticatedUser { authenticatedUser { username, teams { id, name } }}
      ` });
      response.body.data.authenticatedUser.teams.sort((t1: { name: string }, t2: { name: string }) => t1.name.localeCompare(t2.name));
      expect(response.body.data.authenticatedUser.teams).toEqual([{
        id: teams[0].id,
        name: teams[0].name,
      },{
        id: teams[1].id,
        name: teams[1].name,
      }]);
    });

    test('should return an empty array of teams when the user requesting them is not the same as the requested user', async ({ graphql, user, user2, teams, tournaments }) => {
      const query = `
        query getTeam($userID: ID!, $tournamentID: ID!) {
          team(userID: $userID, tournamentID: $tournamentID) {
            __typename
            ... on Team {
              id
              name
              members {
                id
                username
                teams {
                  id
                  name
                }
              }
            }
          }
        }`;
      await graphql.client.login(user2Data);
      const response = await graphql.client.query({ operationName: 'getTeam', query, variables: {
        userID: user.id, tournamentID: tournaments[0].id
      } });
      expect(response.body.data.team.members[0].teams).toHaveLength(0);
      expect(response.body.data.team.members[0].id).toEqual(user.id);
    });
  });


  describe('Query/User.tournamentInvitations', () => {
    test('should return user\'s tournament invitations', async ({ graphql, user, tournaments, tournamentInvitations }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'authenticatedUser', query: `
        query authenticatedUser { authenticatedUser { username, tournamentInvitations { sentAt, tournament { id, name }, invitee { id, username } } }}
      ` });
      response.body.data.authenticatedUser.tournamentInvitations.sort((i1: { sentAt: string }, i2: { sentAt: string }) => i1.sentAt.localeCompare(i2.sentAt));
      expect(response.body.data).toEqual({
        authenticatedUser: {
          username: user.username,
          tournamentInvitations: [{
            invitee: {
              id: user.id,
              username: user.username,
            },
            sentAt: tournamentInvitations[0].sentAt,
            tournament: {
              id: tournaments[2].id,
              name: tournaments[2].name,
            },
          }, {
            invitee: {
              id: user.id,
              username: user.username,
            },
            sentAt: tournamentInvitations[1].sentAt,
            tournament: {
              id: tournaments[3].id,
              name: tournaments[3].name,
            },
          }]
        }
      });
  
    });

  });

  describe('Query/User.organizedTournaments', () => {
    test('should return user\'s organized tournaments', async ({ ctx, graphql, user, tournaments }) => {
      await ctx.providers.tournament.changeTournamentRole(ctx, {
        role: TournamentRole.Organizer, tournamentId: tournaments[0].id, userId: user.id
      });
      await ctx.providers.tournament.changeTournamentRole(ctx, {
        role: TournamentRole.Organizer, tournamentId: tournaments[2].id, userId: user.id
      });

      await graphql.client.login(userData);
  
      const response = await graphql.client.query({ operationName: 'authenticatedUser', query: `
        query authenticatedUser { authenticatedUser { username, organizedTournaments { id, name, myRole } }}
      ` });
      expect(response.body.data).toEqual({
        authenticatedUser: {
          username: user.username,
          organizedTournaments: [
          {
            id: tournaments[0].id,
            name: tournaments[0].name,
            myRole: 'ORGANIZER',
          },
          {
            id: tournaments[2].id,
            name: tournaments[2].name,
            myRole: 'ORGANIZER',
          }]
        }
      });
  
    });

  });
});
