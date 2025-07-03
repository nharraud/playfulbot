
import { afterEach, describe, expect, test as baseTest } from 'vitest';

import { dropTestDB } from '../../utils/psql';
import { TeamProviderPSQL } from '~playfulbot/infrastructure/providers/TeamProviderPSQL';
import { Team } from '~playfulbot/core/entities/Teams';
import { TournamentProviderPSQL } from '~playfulbot/infrastructure/providers/TournamentProviderPSQL';
import { Tournament, TournamentID } from '~playfulbot/core/entities/Tournaments';
import { randomUUID } from 'crypto';
import { User } from '~playfulbot/core/entities/Users';
import { UserProviderPSQL } from '~playfulbot/infrastructure/providers/UserProviderPSQL';
import { TeamNameAlreadyTakenError } from '~playfulbot/core/use-cases/interfaces/TeamProvider';
import { TeamNotFoundError, UserNotFoundError, ValidationError } from '~playfulbot/core/use-cases/Errors';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';
import { mockContextFixture } from 'tests/utils/fixtures';

const dummyUUID = '00000000-0000-4000-9000-000000000000';

async function tournamentFixture({ ctx }: Omit<TestFixtures, 'tournament'>, use: any) {
  const provider = new TournamentProviderPSQL();
  const tournament = await provider.createTournament(ctx, {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  });
  await use(tournament);
}

async function addTeam(ctx: ContextPSQL, teamName: string, tournamentID: TournamentID): Promise<Team> {
  const provider = new TeamProviderPSQL();
  return provider.createTeam(ctx, {
    name: teamName,
    tournamentID: tournamentID,
  }) as Promise<Team>;
}

async function teamFixture({ ctx, tournament }: Omit<TestFixtures, 'team'>, use: any) {
  const team = await addTeam(ctx, 'testTeam', tournament.id);
  await use(team);
}

async function userFixture({ ctx }: Omit<TestFixtures, 'user'>, use: any) {
  const provider = new UserProviderPSQL();
  const user = await provider.createUser(ctx, {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

interface TestFixtures {
  ctx: ContextPSQL,
  tournament: Tournament,
  team: Team,
  user: User,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  team: teamFixture,
  user: userFixture,
});

describe('infrastructure/games/TeamProviderPSQL', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('createTeam', () => {
    test('should create a team', async ({ ctx, tournament }) => {
      const provider = new TeamProviderPSQL();
      const team = await provider.createTeam(ctx, {
        name: 'testTeam2',
        tournamentID: tournament.id,
      });
      expect(team).toEqual({
        id: expect.any(String),
        name: 'testTeam2',
        tournamentId: tournament.id,
      });
    });

    test('should throw an error when team name is too short', async ({ ctx, tournament }) => {
      const provider = new TeamProviderPSQL();
      const result = await provider.createTeam(ctx, {
        name: 't',
        tournamentID: tournament.id,
      });
      expect(result).to.be.instanceOf(ValidationError);
      expect((result as ValidationError).message).toEqual('Invalid Team');
    });

    test('should throw an error when team name is too long', async ({ ctx, tournament }) => {
      const provider = new TeamProviderPSQL();
      const result = await provider.createTeam(ctx, {
        name: '123456789123456789',
        tournamentID: tournament.id,
      });
      expect(result).to.be.instanceOf(ValidationError);
      expect((result as ValidationError).message).toEqual('Invalid Team');
    });

    test('should return TeamNameAlreadyTaken when team name is already taken', async ({ ctx, tournament, team }) => {
      const provider = new TeamProviderPSQL();
      const teamResponse = await provider.createTeam(ctx, {
        name: 'testTeam',
        tournamentID: tournament.id,
      });
      await expect(teamResponse).instanceOf(TeamNameAlreadyTakenError);
    });
  });

  
  describe('updateTeam', () => {
    test('should update the team', async ({ ctx, tournament, team }) => {
      const provider = new TeamProviderPSQL();
      const updatedTeam = await provider.updateTeam(ctx, team.id, {
        name: 'updatedTeamName'
      });
      expect(updatedTeam).toEqual({
        id: team.id,
        name: 'updatedTeamName',
        tournamentId: tournament.id,
      });
    });

    test('should throw an error when team name is too short', async ({ ctx, team }) => {
      const provider = new TeamProviderPSQL();
      const result = await provider.updateTeam(ctx, team.id, {
        name: 'a'
      });
      expect(result).to.be.instanceOf(ValidationError);
      expect((result as ValidationError).message).toEqual('Invalid Team');
    });

    test('should return TeamNameAlreadyTaken when team name is already taken', async ({ ctx, tournament, team }) => {
      const provider = new TeamProviderPSQL();
      await await provider.createTeam(ctx, {
        name: 'newTeam',
        tournamentID: tournament.id,
      });
      const updatedTeam = await provider.updateTeam(ctx, team.id, {
        name: 'newTeam'
      });
      await expect(updatedTeam).instanceOf(TeamNameAlreadyTakenError);
    });
  });


  describe('getByName', () => {
    test('should find team by name', async ({ ctx, team }) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByName(ctx, 'testTeam');
      expect(foundTeam).toEqual(team);
    });

    test('should return null when no user is found', async ({ ctx }) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByName(ctx, 'Unknown');
      expect(foundTeam).toBeNull();
    });
  });


  describe('getTeamByID', () => {
    test('should find Team by id', async ({ ctx, team }) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByID(ctx, team.id);
      expect(foundTeam).toEqual(team);
    });

    test('should return null when no Team is found', async ({ ctx }) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByID(ctx, randomUUID());
      expect(foundTeam).toBeNull();
    });
  });


  describe('getTeamByMember', () => {
    test('should retrun null when the user is not in any team', async ({ ctx, team, user, tournament }) => {
      const teamProvider = new TeamProviderPSQL();

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toBeNull();
    });

    test('should retrun null when the user is not in any team of this tournament', async ({ ctx, team, tournament, user }) => {
      const tournamentProvider = new TournamentProviderPSQL();
      const tournament2 = await tournamentProvider.createTournament(ctx, {
        name: 'testTournament2',
        gameDefinitionId: 'testGame',
        lastRoundDate: '2024-01-02T00:00:00+00',
        minutesBetweenRounds: 60,
        roundsNumber: 10,
        startDate: '2024-01-01T00:00:00+00',
      });

      const teamProvider = new TeamProviderPSQL();
      await teamProvider.addTeamMember(ctx, team.id, user.id);
      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament2.id);
      expect(foundTeam).toBeNull();
    });
  });


  describe('addTeamMember', () => {
    test('should add team member', async ({ ctx, team, user, tournament }) => {
      const teamProvider = new TeamProviderPSQL();

      const result = await teamProvider.addTeamMember(ctx, team.id, user.id);
      expect(result).toEqual(true);

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toEqual(team);
    });

    test('should do nothing if we add user to the team twice', async ({ ctx, team, user, tournament }) => {
      const teamProvider = new TeamProviderPSQL();

      await teamProvider.addTeamMember(ctx, team.id, user.id);
      const result = await teamProvider.addTeamMember(ctx, team.id, user.id);
      expect(result).toEqual(false);

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toEqual(team);
    });

    test('should return an error if the team does not exist', async ({ ctx, user }) => {
      const teamProvider = new TeamProviderPSQL();

      const result = await teamProvider.addTeamMember(ctx, dummyUUID, user.id);
      expect(result).toBeInstanceOf(TeamNotFoundError);
    });

    test('should return an error if the user does not exist', async ({ ctx, team }) => {
      const teamProvider = new TeamProviderPSQL();

      const result = await teamProvider.addTeamMember(ctx, team.id, dummyUUID);
      expect(result).toBeInstanceOf(UserNotFoundError);
    });
  });


  describe('removeTeamMember', () => {
    test('should remove existing team member', async ({ ctx, team, user, tournament }) => {
      const teamProvider = new TeamProviderPSQL();

      await teamProvider.addTeamMember(ctx, team.id, user.id);
      const result = await teamProvider.removeTeamMember(ctx, team.id, user.id);
      expect(result).toEqual(true);

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toBeNull();
    });


    test('should not fail when removing non team member', async ({ ctx, team, user, tournament }) => {
      const teamProvider = new TeamProviderPSQL();

      const result = await teamProvider.removeTeamMember(ctx, team.id, user.id);
      expect(result).toEqual(false);
    });
  });


  describe('isTeamMember', () => {
    test('should return true when user is a team member', async ({ ctx, team, user, tournament }) => {
      const teamProvider = new TeamProviderPSQL();

      await teamProvider.addTeamMember(ctx, team.id, user.id);

      const isMember = await teamProvider.isTeamMember(ctx, team.id, user.id);
      expect(isMember).toEqual(true);
    });

    test('should return false when user is a team member', async ({ ctx, team, user, tournament }) => {
      const teamProvider = new TeamProviderPSQL();

      const isMember = await teamProvider.isTeamMember(ctx, team.id, user.id);
      expect(isMember).toEqual(false);
    });
  });

  describe('countTeamMembers', () => {
    test('should count team members when there are team members', async ({ ctx, team }) => {
      const user1 = await ctx.providers.user.createUser(ctx, {
        username: 'user1',
        password: 'mypassword'
      }) as User;
      const user2 = await ctx.providers.user.createUser(ctx, {
        username: 'user2',
        password: 'mypassword'
      }) as User;
      const provider = new TeamProviderPSQL();
      await provider.addTeamMember(ctx, team.id, user1.id);
      await provider.addTeamMember(ctx, team.id, user2.id);

      const membersCount = await provider.countTeamMembers(ctx, team.id);
      expect(membersCount).toEqual(2);
    });

    test('should return 0 when there are no team members', async ({ ctx, team }) => {
      const provider = new TeamProviderPSQL();
      const membersCount = await provider.countTeamMembers(ctx, team.id);
      expect(membersCount).toEqual(0);
    });

    test('should return 0 when the team does not exist', async ({ ctx, team }) => {
      const provider = new TeamProviderPSQL();
      const membersCount = await provider.countTeamMembers(ctx, '00000000-0000-0000-0000-000000000000');
      expect(membersCount).toEqual(0);
    });
  });
});
