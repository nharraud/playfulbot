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

interface TestFixtures {
  ctx?: Context<any>,
  tournament?: Tournament,
  team?: Team,
  user?: User,
  invitedUser?: User,
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

async function teamFixture({ ctx, tournament }: TestFixtures, use: any) {
  const team = await ctx.providers.team.createTeam(ctx, {
    name: 'testTeam',
    tournamentID: tournament.id,
  });
  await use(team);
}

async function userFixture({ ctx }: TestFixtures, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

async function invitedUserFixture({ ctx, user, tournament }: TestFixtures, use: any) {
  await ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, {
    tournamentId: tournament.id,
    inviteeId: user.id,
  });
  await use(user);
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  user: userFixture,
  invitedUser: invitedUserFixture,
});

describe('use-cases/team/createTeam', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  test('should create team and add team member if user is invited and join=true', async ({ctx, invitedUser, tournament }) => {
    const returnedTeam = await createTeam(ctx, {
      teamName: 'newTeam', userId: invitedUser.id, tournamentId: tournament.id, join: true
    });
    expect(returnedTeam).toEqual({
      id: expect.any(String),
      name: 'newTeam',
      tournamentId: tournament.id,
    });
    const retrievedTeam = await ctx.providers.team.getTeamByID(ctx, (returnedTeam as Team).id);
    expect(retrievedTeam).toEqual(returnedTeam);

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, invitedUser.id, tournament.id);
    expect(foundTeam).toEqual(returnedTeam);
  });

  test('should create team and change team if user is part of another team and join=true', async ({ctx, user, tournament, team }) => {
    await ctx.providers.team.addTeamMember(ctx, team.id, user.id);
    const returnedTeam = await createTeam(ctx, {
      teamName: 'newTeam', userId: user.id, tournamentId: tournament.id, join: true
    });
    expect(returnedTeam).toEqual({
      id: expect.any(String),
      name: 'newTeam',
      tournamentId: tournament.id,
    });
    const retrievedTeam = await ctx.providers.team.getTeamByID(ctx, (returnedTeam as Team).id);
    expect(retrievedTeam).toEqual(returnedTeam);

    const foundTeam = await ctx.providers.team.getTeamByMember(ctx, user.id, tournament.id);
    expect(foundTeam).toEqual(returnedTeam);
  });

  test('should fail if we create a team with a name already taken', async ({ ctx, team, invitedUser, tournament }) => {
    const returnedTeam = await createTeam(ctx, {
      teamName: team.name, userId: invitedUser.id, tournamentId: tournament.id, join: true
    });
    expect(returnedTeam).toBeInstanceOf(TeamNameAlreadyTakenError);
  });

  test('should fail if we create a team with a an invalid name', async ({ ctx, team, invitedUser, tournament }) => {
    const returnedTeam = await createTeam(ctx, {
      teamName: '', userId: invitedUser.id, tournamentId: tournament.id, join: true
    });
    expect(returnedTeam).toBeInstanceOf(ValidationError);
  });

  test('should fail if the user is neither invited nor part of an existing team', async ({ ctx, team, user, tournament }) => {
    const returnedTeam = await createTeam(ctx, {
      teamName: team.name, userId: user.id, tournamentId: tournament.id, join: true
    });
    expect(returnedTeam).toBeInstanceOf(ForbiddenError);
  });
});
