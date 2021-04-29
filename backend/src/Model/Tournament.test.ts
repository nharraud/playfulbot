import { DateTime } from 'luxon';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from './db';
import { createDB, dropDB } from './db/db_admin';
import { gameDefinitions } from './GameDefinition';
import { Tournament } from './Tournaments';
import { config } from './db/config';
import * as gqlTypes from '~playfulbot/types/graphql';

describe('Model/Tournament', () => {
  beforeAll(() => {
    gameDefinitions.set(gameDefinition.name, gameDefinition);
  });

  let oldDatabaseName: string;

  beforeEach(async () => {
    oldDatabaseName = config.DATABASE_NAME;
    config.DATABASE_NAME = `${config.DATABASE_NAME}_model_tournament`;
    await dropDB();
    await createDB();
  });

  afterEach(async () => {
    await dropDB();
    config.DATABASE_NAME = oldDatabaseName;
  });

  test('should be able to create a Tournament', async () => {
    const input = {
      name: 'Team Building',
      status: gqlTypes.TournamentStatus.Created,
      startDate: DateTime.now(),
      lastRoundDate: DateTime.now().plus({ hours: 8 }),
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
      db.default,
      input.id
    );
    expect(tournament).toMatchObject(input);
  });

  test('should not be able to create a tournament ending in the past', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(() =>
      Tournament.create(
        'Team Building',
        DateTime.now().minus({ hours: 8 }),
        DateTime.now().minus({ hours: 1 }),
        5,
        30,
        gameDefinition.name,
        db.default,
        'f00fabe0-0000-0000-0000-000000000001'
      )
    ).rejects.toThrow('Cannot create a Tournament with a last round date in the past');
  });

  test('should not be able to create a tournament with an invalid game name', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(() =>
      Tournament.create(
        'Team Building',
        DateTime.now(),
        DateTime.now().plus({ hours: 1 }),
        5,
        30,
        'InvalidGameName',
        db.default,
        'f00fabe0-0000-0000-0000-000000000001'
      )
    ).rejects.toThrow('Invalid game name');
  });

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
      db.default,
      'f00fabe0-0000-0000-0000-000000000001'
    );
    await tournament.start(db.default);
    const rounds = await tournament.getRounds(db.default);
    expect(rounds.length).toEqual(5);
    expect(rounds[rounds.length - 1].startDate).toEqual(tournament.lastRoundDate);
    expect(rounds[0].startDate).toEqual(end.minus({ minutes: 4 * 30 }));
  });
});
