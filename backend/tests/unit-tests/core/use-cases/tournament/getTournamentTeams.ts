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
import { range } from '~playfulbot/utils/arrays';
import { getTournamentTeams } from '~playfulbot/core/use-cases/tournament/getTournamentTeams';
import { TournamentRole } from '~playfulbot/core/entities/TournamentRole';

interface TestFixtures {
  ctx?: Context<any>,
  tournament?: Tournament,
  teams?: Team[],
  user?: User
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

async function teamsFixture({ ctx, tournament }: TestFixtures, use: any) {
  const teams = await Promise.all(range(5).map(idx =>
    ctx.providers.team.createTeam(ctx, {
      name: `testTeam${idx}`,
      tournamentID: tournament.id,
    })
  ));
  await use(teams);
}

async function userFixture({ ctx }: TestFixtures, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

// async function invitedUserFixture({ ctx, user, tournament }: TestFixtures, use: any) {
//   await ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, {
//     tournamentId: tournament.id,
//     inviteeId: user.id,
//   });
//   await use(user);
// }

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  teams: teamsFixture,
  user: userFixture,
});

describe('use-cases/tournament/getTournamentTeams', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  test('should return an empty array when the user is not invited to the tournament', async ({ ctx, user, tournament, teams }) => {
    ctx = ctx.ctxWithRequestingUserId(user.id);
    const foundTeams = await getTournamentTeams(ctx, { tournamentId: tournament.id });
    expect(foundTeams).toEqual([]);
  });

  test('should return teams when the user is invited to the tournament', async ({ ctx, user, tournament, teams }) => {
    ctx = ctx.ctxWithRequestingUserId(user.id);
    await ctx.providers.tournamentInvitation.createTournamentInvitation(ctx, {
      tournamentId: tournament.id,
      inviteeId: user.id,
    });
    const foundTeams = await getTournamentTeams(ctx, { tournamentId: tournament.id });
    expect(foundTeams).toEqual(teams);
  });

  test('should return teams when the user is a part of a team of this tournament', async ({ ctx, user, tournament, teams }) => {
    ctx = ctx.ctxWithRequestingUserId(user.id);
    await ctx.providers.team.addTeamMember(ctx, teams[0].id, user.id);
    const foundTeams = await getTournamentTeams(ctx, { tournamentId: tournament.id });
    expect(foundTeams).toEqual(teams);
  });

  test('should return teams when the user is an organizer of this tournament', async ({ ctx, user, tournament, teams }) => {
    ctx = ctx.ctxWithRequestingUserId(user.id);
    await ctx.providers.tournament.changeTournamentRole(ctx, {
      tournamentId: tournament.id, userId: user.id, role: TournamentRole.Organizer
    });
    const foundTeams = await getTournamentTeams(ctx, { tournamentId: tournament.id });
    expect(foundTeams).toEqual(teams);
  });
});
