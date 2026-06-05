import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB, initTestDB } from '../../../../utils/psql';
import { createMockContext } from '../../../../utils/context';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { Tournament, TournamentID } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { addTeamMember } from '~playfulbot/core/use-cases/team/addTeamMember';
import { createTeam } from '~playfulbot/core/use-cases/team/createTeam';
import { TeamNameAlreadyTakenError } from '~playfulbot/core/use-cases/interfaces/TeamProvider';
import { ForbiddenError, ValidationError } from '~playfulbot/core/use-cases/Errors';
import { mockContextFixture } from 'tests/utils/fixtures';
import { createArena } from '~playfulbot/core/use-cases/arena/createArena';
import { Arena } from '~playfulbot/core/entities/Arena';
import { MaxArenaReachedError } from '~playfulbot/core/use-cases/interfaces/ArenaProvider';

interface TestFixtures {
  ctx: Context<any>,
  tournament: Tournament,
  team: Team,
  nonTeamMember: User,
  teamMember: User,
}

async function tournamentFixture({ ctx } : Omit<TestFixtures, 'tournament'>, use: any) {
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

async function nonTeamMemberFixture({ ctx }: Omit<TestFixtures, 'nonTeamMember'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'nonTeamMember',
    password: 'mypassword'
  });
  await use(user);
}

async function teamMemberFixture({ ctx, team }: Omit<TestFixtures, 'teamMember'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'teamMember',
    password: 'mypassword'
  }) as User;
  await ctx.providers.team.addTeamMember(ctx, team.id, user.id);
  await use(user);
}


const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  nonTeamMember: nonTeamMemberFixture,
  teamMember: teamMemberFixture,
});

describe('use-cases/arena/createArena', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  test('should create arena if user is part of a team', async ({ctx, teamMember, team, tournament }) => {
    ctx.requestingUserId = teamMember.id;
    const returnedArena = await createArena(ctx, {
      arenaName: 'newArena', userId: teamMember.id, teamId: team.id
    }) as Arena;
    expect(returnedArena).toEqual({
      id: expect.any(String),
      name: 'newArena',
      teamId: team.id,
    });
  });

  test('should create arena if user is not part of a team', async ({ctx, nonTeamMember, team, tournament }) => {
    const result = await createArena(ctx, {
      arenaName: 'newArena', userId: nonTeamMember.id, teamId: team.id
    });
    expect(result).toBeInstanceOf(ForbiddenError);
  });

  test('should return an error if the name is not valid', async ({ctx, teamMember, team, tournament }) => {
    const result = await createArena(ctx, {
      arenaName: '', userId: teamMember.id, teamId: team.id
    }) as Arena;
    expect(result).toBeInstanceOf(ValidationError);
  });

  test('should return an error if the max number of Arena is reached', async ({ctx, teamMember, team, tournament }) => {
    await createArena(ctx, {
      arenaName: '1', userId: teamMember.id, teamId: team.id
    }) as Arena;
    const result = await createArena(ctx, {
      arenaName: '2', userId: teamMember.id, teamId: team.id
    }) as Arena;
    expect(result).toBeInstanceOf(MaxArenaReachedError);
  });

});
