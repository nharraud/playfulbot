import { DateTime } from 'luxon';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from './db';
import { createDB, dropDB } from './db/db_admin';
import { gameDefinitions } from './GameDefinition';
import { Team } from './Team';
import { Tournament } from './Tournaments';
import { config } from './db/config';
import { User } from './User';

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
    tournaments = [];
    tournaments.push(
      await Tournament.create(
        'Team Building 1',
        DateTime.now(),
        DateTime.now().plus({ hours: 8 }),
        5,
        30,
        gameDefinition.name,
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
        db.default,
        `F00FABE0-0000-0000-0000-000000000002`
      )
    );
  });

  afterEach(async () => {
    await dropDB();
    config.DATABASE_NAME = oldDatabaseName;
  });

  test('should be able to create a Team', async () => {
    const team = await Team.create('a team', tournaments[0].id, db.default);
    expect(team).toMatchObject({
      name: 'a team',
      tournamentID: tournaments[0].id,
    });
  });

  test('should be able to add members', async () => {
    await db.default.tx(async (tx) => {
      const team = await Team.create('a team', tournaments[0].id, tx);
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
        const team = await Team.create(`team${idx}`, tournaments[idx].id, tx);
        await team.addMember(user.id, tx);
      }
      const teams = await Team.getAll({ memberID: user.id }, tx);
      expect(teams).toHaveLength(2);
      const teamNames = teams.map((team) => team.name);
      expect(teamNames).toEqual(['team1', 'team0']);
    });
  });
});
