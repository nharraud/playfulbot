import { DateTime } from 'luxon';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from './db';
import { createDB, dropDB } from './db/db_admin';
import { gameDefinitions } from './GameDefinition';
import { Team } from './Team';
import { Tournament } from './Tournaments';
import { config } from './db/config';
import { User } from './User';
import {
  createdTournamentFixture,
  tournamentAdminFixture,
} from './__tests__/fixtures/tournamentFixtures';
import { resetFixtures } from './__tests__/fixtures/reset';
import { newUserFixture } from './__tests__/fixtures/user';
import { teamFixture, teamMemberFixture, teamsFixture } from './__tests__/fixtures/teamFixtures';

describe('Model/Team', () => {
  beforeAll(() => {
    gameDefinitions.set(gameDefinition.name, gameDefinition);
  });

  let oldDatabaseName: string;
  let tournaments: Tournament[];

  beforeEach(async () => {
    oldDatabaseName = config.DATABASE_NAME;
    config.DATABASE_NAME = `${config.DATABASE_NAME}_model_team`;
    await dropDB();
    await createDB();
    const admin = await tournamentAdminFixture();
    tournaments = [];
    tournaments.push(
      await Tournament.create(
        'Team Building 1',
        DateTime.now(),
        DateTime.now().plus({ hours: 8 }),
        5,
        30,
        gameDefinition.name,
        admin.id,
        db.default,
        `F00FABE0-0000-0000-0000-000000000001`
      )
    );
    tournaments.push(
      await Tournament.create(
        'Team Building 2',
        DateTime.now().plus({ hours: 1 }),
        DateTime.now().plus({ hours: 9 }),
        5,
        30,
        gameDefinition.name,
        admin.id,
        db.default,
        `F00FABE0-0000-0000-0000-000000000002`
      )
    );
  });

  afterEach(async () => {
    await dropDB();
    resetFixtures();
    config.DATABASE_NAME = oldDatabaseName;
  });

  test('should be able to create a Team', async () => {
    const team = await Team.create('a team', tournaments[0].id, db.default);
    expect(team).toMatchObject({
      name: 'a team',
      tournamentID: tournaments[0].id,
    });
  });

  test('should be able to update a Team', async () => {
    const team = (await Team.create('old team name', tournaments[0].id, db.default)) as Team;
    const updatedTeam = await Team.update(team.id, { name: 'new team name' }, db.default);
    expect(updatedTeam).toMatchObject({
      name: 'new team name',
      tournamentID: tournaments[0].id,
    });
  });

  test('should be able to add members', async () => {
    await db.default.tx(async (tx) => {
      const team = (await Team.create('a team', tournaments[0].id, tx)) as Team;
      const user = await User.create('Alice', 'a password', tx);
      await team.addMember(user.id, tx);
      const members = await team.getMembers(tx);
      expect(members).toHaveLength(1);
      expect(members[0].id).toEqual(user.id);
    });
  });

  test('should be able to get teams of a given user', async () => {
    await db.default.tx(async (tx) => {
      const user = await User.create('Alice', 'a password', tx);
      for (const [idx, tournament] of tournaments.entries()) {
        const team = (await Team.create(`team${idx}`, tournaments[idx].id, tx)) as Team;
        await team.addMember(user.id, tx);
      }
      const teams = await Team.getAll({ memberID: user.id }, tx);
      expect(teams).toHaveLength(2);
      const teamNames = teams.map((team) => team.name);
      expect(teamNames).toEqual(['team1', 'team0']);
    });
  });

  test('should be able to check if a user is a member with "isMember"', async () => {
    await db.default.tx(async (tx) => {
      const alice = await User.create('Alice', 'a password', tx);
      const aliceTeam = (await Team.create(`aliceTeam`, tournaments[0].id, tx)) as Team;
      await aliceTeam.addMember(alice.id, tx);
      const bob = await User.create('Bob', 'a password', tx);
      const bobTeam = (await Team.create(`bobTeam`, tournaments[0].id, tx)) as Team;
      await aliceTeam.addMember(bob.id, tx);
      const aliceIsMemberOfAliceTeam = await Team.isMember(aliceTeam.id, alice.id, tx);
      const aliceIsMemberOfBobTeam = await Team.isMember(bobTeam.id, alice.id, tx);
      expect(aliceIsMemberOfAliceTeam).toBeTruthy();
      expect(aliceIsMemberOfBobTeam).toBeFalsy();
    });
  });

  test('should know non-team-members with "hasTeam"', async () => {
    await db.default.tx(async (tx) => {
      const newUser = await newUserFixture();
      const tournament = await createdTournamentFixture();
      const hasTeam = await Team.hasTeam(newUser.id, tournament.id, db.default);
      expect(hasTeam).toBeFalsy();
    });
  });

  test('should know team-members with "hasTeam"', async () => {
    await db.default.tx(async (tx) => {
      const tournament = await createdTournamentFixture();
      const teamMember = await teamMemberFixture();
      const hasTeam = await Team.hasTeam(teamMember.id, tournament.id, db.default);
      expect(hasTeam).toBeTruthy();
    });
  });
});
