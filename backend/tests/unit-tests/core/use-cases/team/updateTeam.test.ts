import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB, initTestDB } from '../../../../utils/psql';
import { createMockContext } from '../../../../utils/context';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { createTeam } from '~playfulbot/core/use-cases/team/createTeam';
import { TeamNameAlreadyTakenError } from '~playfulbot/core/use-cases/interfaces/TeamProvider';
import { ForbiddenError, ValidationError } from '~playfulbot/core/use-cases/Errors';
import { updateTeam } from '~playfulbot/core/use-cases/team/updateTeam';
import { mockContextFixture } from 'tests/utils/fixtures';

interface TestFixtures {
  ctx: Context<any>,
  tournament: Tournament,
  team: Team,
  user: User,
  teamMember: User,
}

async function tournamentFixture({ ctx } : Omit<TestFixtures, 'tournament'>, use: any) {
  const tournament = await ctx.providers.tournament.createTournament(ctx, {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    startDate: '2024-01-01T00:00:00+00',
    endDate: '2024-01-02T00:00:00+00',
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

async function userFixture({ ctx }: Omit<TestFixtures, 'user'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

async function teamMemberFixture({ ctx, team }: Omit<TestFixtures, 'teamMember'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'teamMemer',
    password: 'otherpassword'
  }) as User;
  await ctx.providers.team.addTeamMember(ctx,
    team.id,
    user.id,
  );
  await use(user);
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  user: userFixture,
  teamMember: teamMemberFixture,
});

describe('use-cases/team/updateTeam', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  test('should update team', async ({ ctx, teamMember, team, tournament }) => {
    const returnedTeam = await updateTeam(ctx, { teamId: team.id, userId: teamMember.id, patch: { name: 'newName' }});
    expect(returnedTeam).toEqual({
      id: expect.any(String),
      name: 'newName',
      tournamentId: tournament.id,
    });
    const retrievedTeam = await ctx.providers.team.getTeamByID(ctx, (returnedTeam as Team).id);
    expect(retrievedTeam).toEqual(returnedTeam);
  });

  test('should fail if user is not a team member', async ({ ctx, user, team }) => {
    const result = await updateTeam(ctx, { teamId: team.id, userId: user.id, patch: { name: 'newName' }});
    expect(result).toBeInstanceOf(ForbiddenError);
    // check that the team didn't change
    const currentTeam = await ctx.providers.team.getTeamByID(ctx, team.id);
    expect(currentTeam).toEqual(team);
  });

  test('should fail if we create a team with a name already taken', async ({ ctx, team, teamMember, user, tournament }) => {
    ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, { tournamentId: tournament.id, inviteeId: user.id });
    await createTeam(ctx, {
      teamName: 'otherTeam', userId: user.id, tournamentId: tournament.id, join: true
    });
    const result = await updateTeam(ctx, { teamId: team.id, userId: teamMember.id, patch: { name: 'otherTeam' }});
    expect(result).toBeInstanceOf(TeamNameAlreadyTakenError);
    // check that the team didn't change
    const currentTeam = await ctx.providers.team.getTeamByID(ctx, team.id);
    expect(currentTeam).toEqual(team);
  });

  test('should fail if we create a team with a name already taken', async ({ ctx, team, teamMember, user, tournament }) => {
    const result = await updateTeam(ctx, { teamId: team.id, userId: teamMember.id, patch: { name: '' }});
    expect(result).toBeInstanceOf(ValidationError);
    // check that the team didn't change
    const currentTeam = await ctx.providers.team.getTeamByID(ctx, team.id);
    expect(currentTeam).toEqual(team);
  });

  test('should fail if the patch is empty', async ({ ctx, team, teamMember }) => {
    const result = await updateTeam(ctx, { teamId: team.id, userId: teamMember.id, patch: {}});
    expect(result).toBeInstanceOf(ValidationError);
  });
});
