
import { beforeEach, afterEach, describe, expect, test } from 'vitest';

import { dropTestDB, initTestDB } from './utils/psql';
import { TeamProviderPSQL } from '~playfulbot/infrastructure/TeamProviderPSQL';
import { Team } from '~playfulbot/core/entities/Teams';
import { createMockContext } from './utils/context';
import { TournamentProviderPSQL } from '~playfulbot/infrastructure/TournamentProviderPSQL';
import { Tournament, TournamentID } from '~playfulbot/core/entities/Tournaments';
import { randomUUID } from 'crypto';
import { User } from '~playfulbot/core/entities/Users';
import { UserProviderPSQL } from '~playfulbot/infrastructure/UserProviderPSQL';

async function tournamentFixture({}, use: any) {
  const provider = new TournamentProviderPSQL();
  const tournament = await provider.createTournament(createMockContext(), {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  });
  await use(tournament);
}

function addTeam(teamName: string, tournamentID: TournamentID): Promise<Team> {
  const provider = new TeamProviderPSQL();
  return provider.createTeam(createMockContext(), {
    name: teamName,
    tournamentID: tournamentID,
  });
}

async function teamFixture({ tournament }: any, use: any) {
  const team = await addTeam('testTeam', tournament.id);
  await use(team);
}

async function userFixture({}: any, use: any) {
  const provider = new UserProviderPSQL();
  const user = await provider.createUser(createMockContext(), {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

interface TestFixtures {
  tournament: Tournament,
  team: Team,
  user: User,
}

const ctest = test.extend<TestFixtures>({
  tournament: tournamentFixture,
  team: teamFixture,
  user: userFixture,
});

describe('infrastructure/games/TeamProviderPSQL', () => {
  beforeEach(async () => {
    await initTestDB();
  });

  afterEach(async () => {
    await dropTestDB();
  });

  describe('createTeam', () => {
    ctest('should create a team', async ({ tournament }) => {
      const provider = new TeamProviderPSQL();
      const team = await provider.createTeam(createMockContext(), {
        name: 'testTeam2',
        tournamentID: tournament.id,
      });
      expect(team).toEqual({
        id: expect.any(String),
        name: 'testTeam2',
        tournamentId: tournament.id,
      });
    });

    ctest('should throw an error when team name is too short', async ({ tournament }) => {
      const provider = new TeamProviderPSQL();
      const teamPromise = provider.createTeam(createMockContext(), {
        name: 't',
        tournamentID: tournament.id,
      });
      await expect(teamPromise).rejects.toThrowError('Invalid Team');
    });
  });

  
  describe('updateTeam', () => {
    ctest('should update the team', async ({ tournament, team }) => {
      const provider = new TeamProviderPSQL();
      const updatedTeam = await provider.updateTeam(createMockContext(), team.id, {
        name: 'updatedTeamName'
      });
      expect(updatedTeam).toEqual({
        id: team.id,
        name: 'updatedTeamName',
        tournamentId: tournament.id,
      });
    });

    ctest('should throw an error when team name is too short', async ({ team }) => {
      const provider = new TeamProviderPSQL();
      const teamPromise = provider.updateTeam(createMockContext(), team.id, {
        name: 'a'
      });
      await expect(teamPromise).rejects.toThrowError('Invalid Team');
    });
  });


  describe('getByName', () => {
    ctest('should find team by name', async ({ team }) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByName(createMockContext(), 'testTeam');
      expect(foundTeam).toEqual(team);
    });

    ctest('should return null when no user is found', async ({}) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByName(createMockContext(), 'Unknown');
      expect(foundTeam).toBeNull();
    });
  });


  describe('getTeamByID', () => {
    ctest('should find Team by id', async ({ team }) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByID(createMockContext(), team.id);
      expect(foundTeam).toEqual(team);
    });

    ctest('should return null when no Team is found', async ({}) => {
      const provider = new TeamProviderPSQL();
      const foundTeam = await provider.getTeamByID(createMockContext(), randomUUID());
      expect(foundTeam).toBeNull();
    });
  });


  describe('getTeamByMember', () => {
    ctest('should retrun null when the user is not in any team', async ({ team, user, tournament }) => {
      const ctx = createMockContext();
      const teamProvider = new TeamProviderPSQL();

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toBeNull();
    });

    ctest('should retrun null when the user is not in any team of this tournament', async ({ team, tournament, user }) => {
      const tournamentProvider = new TournamentProviderPSQL();
      const tournament2 = await tournamentProvider.createTournament(createMockContext(), {
        name: 'testTournament2',
        gameDefinitionId: 'testGame',
        lastRoundDate: '2024-01-02T00:00:00+00',
        minutesBetweenRounds: 60,
        roundsNumber: 10,
        startDate: '2024-01-01T00:00:00+00',
      });

      const ctx = createMockContext();
      const teamProvider = new TeamProviderPSQL();
      await teamProvider.addTeamMember(ctx, team.id, user.id);
      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament2.id);
      expect(foundTeam).toBeNull();
    });
  });


  describe('addTeamMember', () => {
    ctest('should add team member', async ({ team, user, tournament }) => {
      const ctx = createMockContext();
      const teamProvider = new TeamProviderPSQL();

      const result = await teamProvider.addTeamMember(ctx, team.id, user.id);
      expect(result).toEqual({ oldTeam: null });

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toEqual(team);
    });

    ctest('should do nothing if we add user to the team twice', async ({ team, user, tournament }) => {
      const ctx = createMockContext();
      const teamProvider = new TeamProviderPSQL();

      await teamProvider.addTeamMember(ctx, team.id, user.id);
      const result = await teamProvider.addTeamMember(ctx, team.id, user.id);
      expect(result).toEqual({ oldTeam: team, oldTeamDeleted: false });

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toEqual(team);
    });

    ctest('should remove the user from its previous team if there was one', async ({ team, user, tournament }) => {
      const team2 = await addTeam('testTeam2', tournament.id);
      const ctx = createMockContext();
      const teamProvider = new TeamProviderPSQL();

      await teamProvider.addTeamMember(ctx, team.id, user.id);
      const result = await teamProvider.addTeamMember(ctx, team2.id, user.id);
      expect(result).toEqual({ oldTeam: team, oldTeamDeleted: true });

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toEqual(team2);
    });
  });


  describe('removeTeamMember', () => {
    ctest('should remove team member', async ({ team, user, tournament }) => {
      const ctx = createMockContext();
      const teamProvider = new TeamProviderPSQL();

      await teamProvider.addTeamMember(ctx, team.id, user.id);
      const result = await teamProvider.removeTeamMember(ctx, team.id, user.id);
      expect(result).toEqual({ memberRemoved: true, teamDeleted: true });

      const foundTeam = await teamProvider.getTeamByMember(ctx, user.id, tournament.id);
      expect(foundTeam).toBeNull();
    });
    
  });
});
