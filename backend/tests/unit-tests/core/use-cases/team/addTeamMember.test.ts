import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB, initTestDB } from '../../../../utils/psql';
import { createMockContext } from '../../../../utils/context';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { Tournament, TournamentID } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { addTeamMember } from '~playfulbot/core/use-cases/team/addTeamMember';
import { TeamNotFoundError, UserNotFoundError } from '~playfulbot/core/use-cases/Errors';

interface TestFixtures {
  ctx?: Context<any>,
  tournament?: Tournament,
  team?: Team,
  user?: User,
}

const dummyUUID = '00000000-0000-4000-9000-000000000000';

async function contextFixture({}: TestFixtures, use: any) {
  await use(createMockContext());
}

async function tournamentFixture({ ctx } : TestFixtures, use: any) {
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

function addTeam(ctx: Context<any>, teamName: string, tournamentID: TournamentID): Promise<Team> {
  return ctx.providers.team.createTeam(createMockContext(), {
    name: teamName,
    tournamentID: tournamentID,
  }) as Promise<Team>;
}

async function teamFixture({ ctx, tournament }: TestFixtures, use: any) {
  const team = await addTeam(ctx, 'testTeam', tournament.id);
  await use(team);
}

async function userFixture({ ctx }: TestFixtures, use: any) {
  const user = await ctx.providers.user.createUser(createMockContext(), {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

const test = baseTest.extend<TestFixtures>({
  ctx: contextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  user: userFixture,
});

describe('use-cases/team/addTeamMember', () => {
  beforeEach(async () => {
    await initTestDB()
  });

  afterEach(async () => {
    await dropTestDB();
  });

  test('should add team member', async ({ctx, team, user, tournament }) => {
    const result = await addTeamMember(ctx, { teamId: team.id, userId: user.id });
    expect(result).toEqual({ oldTeam: null });

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
    expect(foundTeam).toEqual(team);
  });

  test('should do nothing if we add user to the team twice', async ({ ctx, team, user, tournament }) => {
    await addTeamMember(ctx, { teamId: team.id, userId: user.id });
    const result = await addTeamMember(ctx, { teamId: team.id, userId: user.id });
    expect(result).toEqual({ oldTeam: team, oldTeamDeleted: false });

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
    expect(foundTeam).toEqual(team);
  });

  test('should remove the user from its previous team if there was one', async ({ ctx, team, user, tournament }) => {
    const team2 = await addTeam(ctx, 'testTeam2', tournament.id);

    await addTeamMember(ctx, { teamId: team.id, userId: user.id });
    const result = await addTeamMember(ctx, { teamId: team2.id, userId: user.id });
    expect(result).toEqual({ oldTeam: team, oldTeamDeleted: true });

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
    expect(foundTeam).toEqual(team2);
  });

  test('should return an error if the requested team does not exist', async ({ ctx, user, tournament }) => {
    const result = await addTeamMember(ctx, { teamId: dummyUUID, userId: user.id, tournamentId: tournament.id });
    expect(result).toBeInstanceOf(TeamNotFoundError);
  });

  test('should return an error if the requested user does not exist', async ({ ctx, team, tournament }) => {
    const result = await addTeamMember(ctx, { teamId: team.id, userId: dummyUUID, tournamentId: tournament.id });
    expect(result).toBeInstanceOf(UserNotFoundError);
  });
})
