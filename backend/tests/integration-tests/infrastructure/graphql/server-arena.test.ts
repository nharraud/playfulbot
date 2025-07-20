import { afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB } from '../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { graphqlFixture, graphqlFixtureType } from './fixtures/baseFixtures';
import { mockContextFixture } from '../../../utils/fixtures';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { hideErrorLogs } from './utils/logger';
import { Arena } from '~playfulbot/core/entities/Arena';
import { PSQLGameRunnerMock } from 'tests/utils/PSQLGameRunnerMock';

const userData = { username: 'testuser', password: 'testpassword' };
const teamMemberData = { username: 'teamMember', password: 'otherpass' };
const teamMember2Data = { username: 'teamMember2', password: 'otherpass' };
const nonTeamMemberData = { username: 'nonTeamMember', password: 'otherpass' };
const differentTeamMemberData = { username: 'diffTeamMember', password: 'otherpass' };

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

async function differentTeamMemberFixture({ ctx, tournament }: Omit<TestFixtures, 'differentTeamMember'>, use: any) {
  const team = await ctx.providers.team.createTeam(ctx, {
    name: 'testTeam2',
    tournamentID: tournament.id,
  }) as Team;
  const teamMember = await ctx.providers.user.createUser(ctx, differentTeamMemberData) as User;
  ctx.providers.team.addTeamMember(ctx, team.id, teamMember.id);
  await use(teamMember);
}

async function arenaFixture({ ctx, team }: Omit<TestFixtures, 'arena'>, use: any) {
  const arena = await ctx.providers.arena.createArena(ctx, {
    name: 'testArena',
    teamId: team.id
  });
  await use(arena);
}

interface TestFixtures {
  ctx: Context<any>,
  graphql: graphqlFixtureType,
  tournament: Tournament,
  team: Team,
  teamMember: User,
  teamMember2: User,
  nonTeamMember: User,
  differentTeamMember: User,
  arena: Arena,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  teamMember: teamMemberFixture,
  teamMember2: teamMember2Fixture,
  nonTeamMember: nonTeamMemberFixture,
  differentTeamMember: differentTeamMemberFixture,
  arena: arenaFixture,
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

  describe('Mutation/createArenaGame', () => {
    const query = `
      mutation createArenaGame($arenaID: ID!) {
        createArenaGame(arenaID: $arenaID) {
          __typename
          ... on CreateArenaGameSuccess {
            gameID
          }
          ... on CreateArenaGameFailure {
            errors {
              ... on Error {
                __typename
                message
              }
            }
          }
        }
      }`;

    test('should fail if user is not authenticated', async ({ arena, graphql }) => {
      hideErrorLogs();
      const response = await graphql.client.query({ operationName: 'createArenaGame', query: query, variables: {
        arenaID: arena.id
      } });
      expect(response.body.data.createArenaGame).eql(null);
      expect(response.body.errors[0].extensions.code).eql('UNAUTHENTICATED');
    });

    test('should fail if user is not part of a team', async ({ arena, nonTeamMember, graphql }) => {
      await graphql.client.login(nonTeamMemberData);
      const response = await graphql.client.query({ operationName: 'createArenaGame', query: query, variables: {
        arenaID: arena.id
      } });
      expect(response.body.data.createArenaGame.errors[0].__typename).eql('ForbiddenError');
    });

    test('should fail if user is not part the arena\'s team', async ({ arena, differentTeamMember, graphql }) => {
      await graphql.client.login(differentTeamMemberData);
      const response = await graphql.client.query({ operationName: 'createArenaGame', query: query, variables: {
        arenaID: arena.id
      } });
      expect(response.body.data.createArenaGame.errors[0].__typename).eql('ForbiddenError');
    });

    test('should succeed at creating a game', async ({ ctx, arena, teamMember, graphql }) => {
      await graphql.client.login(teamMemberData);
      const response = await graphql.client.query({ operationName: 'createArenaGame', query: query, variables: {
        arenaID: arena.id
      } });
      const gameId = response.body.data.createArenaGame.gameID;
      const game = await ctx.providers.gameRepository.getFullGame(gameId);
      expect(game.arenaId).toEqual(arena.id);
    });

    test('should cancel previous game', async ({ ctx, arena, teamMember, graphql }) => {
      await graphql.client.login(teamMemberData);
      const response1 = await graphql.client.query({ operationName: 'createArenaGame', query: query, variables: {
        arenaID: arena.id
      } });
      const response2 = await graphql.client.query({ operationName: 'createArenaGame', query: query, variables: {
        arenaID: arena.id
      } });
      const game1Id = response1.body.data.createArenaGame.gameID;
      const game1 = await ctx.providers.gameRepository.getFullGame(game1Id);
      expect(game1.arenaId).toEqual(arena.id);
      expect(game1.cancelled).toEqual(true);

      const game2Id = response2.body.data.createArenaGame.gameID;
      const game2 = await ctx.providers.gameRepository.getFullGame(game2Id);
      expect(game2.arenaId).toEqual(arena.id);
      expect(game2.cancelled).toEqual(false);
    });
  });


  describe('Subscription/arenaGames', () => {
    const query = `
      subscription arenaGames($arenaID: ID!) {
        arenaGames(arenaID: $arenaID) {
          __typename
          ... on GameRef {
            gameID
            graphqlUrl
          }
          ... on ArenaGamesFailure {
            errors {
              ... on Error {
                __typename
                message
              }
            }
          }
        }
      }`;
    
    
  const createQuery = `
    mutation createArenaGame($arenaID: ID!) {
      createArenaGame(arenaID: $arenaID) {
        __typename
        ... on CreateArenaGameSuccess {
          gameID
        }
        ... on CreateArenaGameFailure {
          errors {
            ... on Error {
              __typename
              message
            }
          }
        }
      }
    }`;

    // test('should fail if user is not authenticated', async ({ arena, graphql }) => {
    //   hideErrorLogs();
    //   const response = await graphql.client.query({ operationName: 'arenaGames', query: query, variables: {
    //     arenaID: arena.id
    //   } });
    //   expect(response.body.data.createArenaGame).eql(null);
    //   expect(response.body.errors[0].extensions.code).eql('UNAUTHENTICATED');
    // });

    test('should fail if user is not part of a team', async ({ arena, nonTeamMember, graphql }) => {
      const wsClient = await graphql.createWsClient(nonTeamMemberData);
      const stream = await wsClient.iterate({ query: query, variables: {
        arenaID: arena.id
      } });
      const result: Array<any> = [];
      for await(const item of stream) {
        result.push(item);
      };
      expect(result).toHaveLength(1);
      expect(result[0].data.arenaGames.errors[0].__typename).toEqual('ForbiddenError');
      // const result1 = await results.next();
      // expect(result1.value.data.arenaGames.errors[0].__typename).eql('ForbiddenError');
      // const result2 = await results.next();
      // expect(result2.done).toEqual(true);
    });

    test('should fail if user is not part the arena\'s team', async ({ arena, differentTeamMember, graphql }) => {
      const wsClient = await graphql.createWsClient(differentTeamMemberData);
      const stream = await wsClient.iterate({ query: query, variables: {
        arenaID: arena.id
      } });
      const result: Array<any> = [];
      for await(const item of stream) {
        result.push(item);
      };
      expect(result).toHaveLength(1);
      expect(result[0].data.arenaGames.errors[0].__typename).toEqual('ForbiddenError');
    });


    test('should stream games', async ({ ctx, arena, teamMember, graphql }) => {
      const wsClient = await graphql.createWsClient(teamMemberData);
      const runner1 = await PSQLGameRunnerMock.create();
      const runner2 = await PSQLGameRunnerMock.create();
      
      const stream = await wsClient.iterate({ query: query, variables: {
        arenaID: arena.id
      } });

      const createResponse1 = await graphql.client.query({ operationName: 'createArenaGame', query: createQuery, variables: {
        arenaID: arena.id
      } });
      const game1Id = createResponse1.body.data.createArenaGame.gameID;
      await runner1.fetchGame();

      const createResponse2 = await graphql.client.query({ operationName: 'createArenaGame', query: createQuery, variables: {
        arenaID: arena.id
      } });
      const game2Id = createResponse2.body.data.createArenaGame.gameID;
      await runner2.fetchGame();

      const game1 = await stream.next();
      expect(game1.value.data).toMatchObject({
        arenaGames: {
          '__typename': 'GameRef',
          gameID: game1Id,
          graphqlUrl: runner1.graphqlUrl,
        }
      });

      const game2 = await stream.next();
      expect(game2.value.data).toMatchObject({
        arenaGames: {
          '__typename': 'GameRef',
          gameID: game2Id,
          graphqlUrl: runner2.graphqlUrl,
        }
      });
    });
  });
});
