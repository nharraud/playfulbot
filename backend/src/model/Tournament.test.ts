import { Settings, DateTime } from 'luxon';
import { db } from './db';
import { createDB, dropDB } from './db/db_admin';
import { Tournament } from './Tournaments';
import { config } from './db/config';
import * as gqlTypes from '~playfulbot/types/graphql';
import { tournamentAdminFixture } from './__tests__/fixtures/tournamentFixtures';
import { User } from './User';
import { resetFixtures } from './__tests__/fixtures/reset';
import { gameDefinition } from '~playfulbot/games/__tests__/fixtures/testgame';

jest.mock('~playfulbot/games');

describe('Model/Tournament', () => {
  const now = DateTime.fromISO('2021-01-01T00:00:00.000');

  let oldDatabaseName: string;
  let admin: User;

  beforeEach(async () => {
    Settings.now = () => now.valueOf();
    oldDatabaseName = config.DATABASE_NAME;
    config.DATABASE_NAME = `${config.DATABASE_NAME}_model_tournament`;
    await dropDB();
    await createDB();
    admin = await tournamentAdminFixture();
  });

  afterEach(async () => {
    await dropDB();
    resetFixtures();
    config.DATABASE_NAME = oldDatabaseName;
  });

  test('should be able to create a Tournament', async () => {
    const input = {
      name: 'Team Building',
      status: gqlTypes.TournamentStatus.Created,
      startDate: DateTime.now().plus({ days: 3 }),
      lastRoundDate: DateTime.now().plus({ days: 3, hours: 3 }),
      roundsNumber: 5,
      minutesBetweenRounds: 30,
      id: 'f00fabe0-0000-0000-0000-000000000001',
    };
    const tournament = await Tournament.create(
      input.name,
      input.startDate,
      input.lastRoundDate,
      input.roundsNumber,
      input.minutesBetweenRounds,
      gameDefinition.name,
      admin.id,
      db.default,
      input.id
    );
    expect(tournament).toMatchObject(input);
  });

  test('should not be able to create a tournament starting after its first round', () =>
    expect(() =>
      Tournament.create(
        'Team Building',
        DateTime.now().plus({ hours: 4 }),
        DateTime.now().plus({ hours: 5 }),
        5,
        30,
        gameDefinition.name,
        admin.id,
        db.default,
        'f00fabe0-0000-0000-0000-000000000001'
      )
    ).rejects.toThrow('Cannot create a Tournament with a start date after the first round date'));

  test('should not be able to create a tournament with a first round in the past', () =>
    expect(() =>
      Tournament.create(
        'Team Building',
        DateTime.now().minus({ hours: 1 }),
        DateTime.now().plus({ hours: 1 }),
        4,
        30,
        gameDefinition.name,
        admin.id,
        db.default,
        'f00fabe0-0000-0000-0000-000000000001'
      )
    ).rejects.toThrow('Cannot create a Tournament with a first round date in the past'));

  test('should not be able to create a tournament with an invalid game name', () =>
    expect(() =>
      Tournament.create(
        'Team Building',
        DateTime.now(),
        DateTime.now().plus({ hours: 10 }),
        5,
        30,
        'InvalidgameDefinition.name',
        admin.id,
        db.default,
        'f00fabe0-0000-0000-0000-000000000001'
      )
    ).rejects.toThrow('Invalid game name'));

  test('should create rounds when starting', async () => {
    const start = DateTime.now();
    const end = start.plus({ hours: 8 });
    const tournament = await Tournament.create(
      'Team Building',
      start,
      end,
      5,
      30,
      gameDefinition.name,
      admin.id,
      db.default,
      'f00fabe0-0000-0000-0000-000000000001'
    );
    await tournament.start(db.default);
    const rounds = await tournament.getRounds(
      {
        startingBefore: tournament.lastRoundDate.plus({ seconds: 1 }),
        maxSize: tournament.roundsNumber,
      },
      db.default
    );
    expect(rounds.length).toEqual(5);
    expect(rounds[rounds.length - 1].startDate).toEqual(tournament.lastRoundDate);
    expect(rounds[0].startDate).toEqual(end.minus({ minutes: 4 * 30 }));
  });

  test('should filter rounds as requested', async () => {
    const start = DateTime.now();
    const end = start.plus({ hours: 8 });
    const tournament = await Tournament.create(
      'Team Building',
      start,
      end,
      5,
      30,
      gameDefinition.name,
      admin.id,
      db.default,
      'f00fabe0-0000-0000-0000-000000000001'
    );
    await tournament.start(db.default);

    // test after
    const queryDate = end.minus({ minutes: 40 });
    const roundsAfter = await tournament.getRounds(
      { startingAfter: queryDate, maxSize: 3 },
      db.default
    );
    expect(roundsAfter.length).toEqual(2);
    const datesAfter = roundsAfter.map((round) => round.startDate);
    expect(datesAfter).toEqual([
      tournament.lastRoundDate.minus({ minutes: 30 }),
      tournament.lastRoundDate,
    ]);

    // test before
    const roundsBefore = await tournament.getRounds(
      { startingBefore: queryDate, maxSize: 3 },
      db.default
    );
    expect(roundsBefore.length).toEqual(3);
    const datesBefore = roundsBefore.map((round) => round.startDate);
    expect(datesBefore).toEqual([
      tournament.lastRoundDate.minus({ minutes: 120 }),
      tournament.lastRoundDate.minus({ minutes: 90 }),
      tournament.lastRoundDate.minus({ minutes: 60 }),
    ]);

    // test without before or after
    const withoutDate = await tournament.getRounds({ maxSize: 3 }, db.default);
    expect(withoutDate.length).toEqual(1);
    expect(withoutDate[0].startDate).toEqual(tournament.nextRoundDate);

    Settings.now = () => tournament.lastRoundDate.minus({ minutes: 40 }).valueOf();

    const withoutDate2 = await tournament.getRounds({ maxSize: 3 }, db.default);
    const datesBefore2 = withoutDate2.map((round) => round.startDate);
    expect(datesBefore2).toEqual([
      tournament.lastRoundDate.minus({ minutes: 120 }),
      tournament.lastRoundDate.minus({ minutes: 90 }),
      tournament.lastRoundDate.minus({ minutes: 60 }),
    ]);
  });

  test('firstRoundDate should provide the first round date', async () => {
    const start = now.minus({ hours: 2, minutes: 10 });
    const end = now.plus({ hours: 8, minutes: 20 });
    const tournament = await Tournament.create(
      'Team Building',
      start,
      end,
      5,
      30,
      gameDefinition.name,
      admin.id,
      db.default,
      'f00fabe0-0000-0000-0000-000000000001'
    );
    await tournament.start(db.default);
    expect(tournament.firstRoundDate).toEqual(end.minus({ minutes: 4 * 30 }));
  });

  test('nextRoundDate should provide the first round date when now is before this date', async () => {
    const start = now.minus({ hours: 2, minutes: 10 });
    const end = now.plus({ hours: 8, minutes: 20 });
    const tournament = await Tournament.create(
      'Team Building',
      start,
      end,
      5,
      30,
      gameDefinition.name,
      admin.id,
      db.default,
      'f00fabe0-0000-0000-0000-000000000001'
    );
    await tournament.start(db.default);
    expect(tournament.nextRoundDate).toEqual(tournament.firstRoundDate);
  });

  test('nextRoundDate should provide the next round date', async () => {
    const end = now.plus({ hours: 3, minutes: 30 });
    const tournament = await Tournament.create(
      'Team Building',
      now,
      end,
      5,
      30,
      gameDefinition.name,
      admin.id,
      db.default,
      'f00fabe0-0000-0000-0000-000000000001'
    );
    Settings.now = () => now.plus({ hours: 2, minutes: 10 }).valueOf();
    await tournament.start(db.default);
    expect(tournament.nextRoundDate).toEqual(end.minus({ minutes: 30 * 3 }));
  });
});
