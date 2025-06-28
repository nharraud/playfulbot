import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB, initTestDB } from '../../../../utils/psql';
import { createMockContext } from '../../../../utils/context';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { Tournament, TournamentID } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { removeTeamMember } from '~playfulbot/core/use-cases/team/removeTeamMember';
import { mockContextFixture } from 'tests/utils/fixtures';

interface TestFixtures {
  ctx?: Context<any>,
  tournament?: Tournament,
  team?: Team,
  user?: User,
}

async function tournamentFixture({ ctx } : TestFixtures, use: any) {
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

function addTeam(ctx: Context<any>, teamName: string, tournamentID: TournamentID): Promise<Team> {
  return ctx.providers.team.createTeam(ctx, {
    name: teamName,
    tournamentID: tournamentID,
  }) as Promise<Team>;
}

async function teamFixture({ ctx, tournament }: TestFixtures, use: any) {
  const team = await addTeam(ctx, 'testTeam', tournament.id);
  await use(team);
}

async function userFixture({ ctx }: TestFixtures, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  user: userFixture,
});

describe('use-cases/team/addTeamMember', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  test('should remove team member', async ({ ctx, team, user, tournament }) => {
    ctx.providers.team.addTeamMember(ctx, team.id, user.id);
    const result = await removeTeamMember(ctx, team.id, user.id);
    expect(result).toEqual({ memberRemoved: true, teamDeleted: true });

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
    expect(foundTeam).toBeNull();
  });

  test('should not remove non team members', async ({ ctx, team, user, tournament }) => {
    const team2 = await ctx.providers.team.createTeam(ctx, {
      name: 'otherTeam',
      tournamentID: tournament.id,
    }) as Team;
    ctx.providers.team.addTeamMember(ctx, team2.id, user.id);

    const result = await removeTeamMember(ctx, team.id, user.id);
    expect(result).toEqual({ memberRemoved: false, teamDeleted: false });

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
    expect(foundTeam.id).toEqual(team2.id);
  });

  test('should not delete teams when they still have members', async ({ ctx, team, user, tournament }) => {
    const user2 = await ctx.providers.user.createUser(ctx, {
      username: 'testUser2',
      password: 'mypassword'
    }) as User;
    await ctx.providers.team.addTeamMember(ctx, team.id, user.id);
    await ctx.providers.team.addTeamMember(ctx, team.id, user2.id);

    const result = await removeTeamMember(ctx, team.id, user.id);
    expect(result).toEqual({ memberRemoved: true, teamDeleted: false });

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
    expect(foundTeam).toBeNull();

    const foundTeam2 = await ctx.providers.team.getTeamByMember(ctx, user2.id, tournament.id);
    expect(foundTeam2.id).toEqual(team.id);
  });
});
