import { afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB } from '../../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { ForbiddenError } from '~playfulbot/core/use-cases/Errors';
import { ArenaNotFoundError } from '~playfulbot/core/use-cases/Errors';
import { mockContextFixture } from 'tests/utils/fixtures';
import { createArena } from '~playfulbot/core/use-cases/arena/createArena';
import { deleteArena } from '~playfulbot/core/use-cases/arena/deleteArena';
import { Arena } from '~playfulbot/core/entities/Arena';
import { ArenaID } from '~playfulbot/core/entities/base-types';
import { randomUUID } from 'crypto';

interface TestFixtures {
  ctx: Context<any>,
  tournament: Tournament,
  team: Team,
  nonTeamMember: User,
  teamMember: User,
  arena: Arena,
}

async function tournamentFixture({ ctx }: Omit<TestFixtures, 'tournament'>, use: any) {
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

async function nonTeamMemberFixture({ ctx }: Omit<TestFixtures, 'nonTeamMember'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'nonTeamMember',
    password: 'mypassword',
  });
  await use(user);
}

async function teamMemberFixture({ ctx, team }: Omit<TestFixtures, 'teamMember'>, use: any) {
  const user = await ctx.providers.user.createUser(ctx, {
    username: 'teamMember',
    password: 'mypassword',
  }) as User;
  await ctx.providers.team.addTeamMember(ctx, team.id, user.id);
  await use(user);
}

async function arenaFixture({ ctx, teamMember, team }: Omit<TestFixtures, 'arena'>, use: any) {
  const arena = await createArena(ctx, {
    arenaName: 'testArena',
    userId: teamMember.id,
    teamId: team.id,
  }) as Arena;
  await use(arena);
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  nonTeamMember: nonTeamMemberFixture,
  teamMember: teamMemberFixture,
  arena: arenaFixture,
});

describe('use-cases/arena/deleteArena', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  test('should delete arena if user is part of the team', async ({ ctx, teamMember, arena }) => {
    const result = await deleteArena(ctx, { userId: teamMember.id, arenaId: arena.id });
    expect(result).toBe(arena.id);
    const foundArena = await ctx.providers.arena.getArena(ctx, arena.id);
    expect(foundArena).toBeNull();
  });

  test('should return ForbiddenError if user is not part of the team', async ({ ctx, nonTeamMember, arena }) => {
    const result = await deleteArena(ctx, { userId: nonTeamMember.id, arenaId: arena.id });
    expect(result).toBeInstanceOf(ForbiddenError);
  });

  test('should return ArenaNotFoundError if arena does not exist', async ({ ctx, teamMember }) => {
    const result = await deleteArena(ctx, { userId: teamMember.id, arenaId: randomUUID() as ArenaID });
    expect(result).toBeInstanceOf(ArenaNotFoundError);
  });

  test('should return ArenaNotFoundError when deleting an already deleted arena', async ({ ctx, teamMember, arena }) => {
    await deleteArena(ctx, { userId: teamMember.id, arenaId: arena.id });
    const result = await deleteArena(ctx, { userId: teamMember.id, arenaId: arena.id });
    expect(result).toBeInstanceOf(ArenaNotFoundError);
  });
});