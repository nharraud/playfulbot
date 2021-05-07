import { DateTime, Duration, Settings } from 'luxon';
import FakeTimers from '@sinonjs/fake-timers';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from '~playfulbot/model/db';
import { config } from '~playfulbot/model/db/config';
import { createDB, dropDB } from '~playfulbot/model/db/db_admin';
import { gameDefinitions } from '~playfulbot/model/GameDefinition';
import { Tournament, TournamentStatus } from '~playfulbot/model/Tournaments';
import { Scheduler } from './Scheduler';
import { Round, RoundStatus } from '~playfulbot/model/Round';

describe('Scheduler', () => {
  // const now = DateTime.fromISO('2021-01-01T00:00:00.000');
  let oldDatabaseName: string;
  let clock: FakeTimers.InstalledClock;

  beforeAll(() => {
    gameDefinitions.set(gameDefinition.name, gameDefinition);
  });

  beforeEach(async () => {
    oldDatabaseName = config.DATABASE_NAME;
    config.DATABASE_NAME = `${config.DATABASE_NAME}_scheduler`;
    await dropDB();
    await createDB();

    clock = FakeTimers.install({
      shouldAdvanceTime: true,
      advanceTimeDelta: 40,
      now: DateTime.fromISO('2021-01-01T00:00:00.000').toMillis(),
    });
  });

  afterEach(async () => {
    await dropDB();
    config.DATABASE_NAME = oldDatabaseName;
    clock.uninstall();
    clock = undefined;
  });

  test('scheduler should start future tournaments', async () => {
    const now = DateTime.now();
    const tournament = await Tournament.create(
      'Team Building 2',
      now.plus({ hours: 3 }),
      now.plus({ hours: 8 }),
      5,
      30,
      gameDefinition.name,
      db.default,
      `F00FABE0-0000-0000-0000-000000000001`
    );

    const scheduler = new Scheduler();
    await scheduler.start();
    expect(tournament.status).toEqual(TournamentStatus.Created);
    await clock.tickAsync(Duration.fromObject({ hours: 3, minutes: 1 }).toMillis());
    await scheduler.stop();

    const updatedTournament = await Tournament.getByID(tournament.id, db.default);
    expect(updatedTournament.status).toEqual(TournamentStatus.Started);
  });

  test('scheduler should start missed and future rounds', async () => {
    const now = DateTime.now();
    const tournament = await Tournament.create(
      'Team Building 2',
      now,
      now.plus({ hours: 1 }),
      4,
      15,
      gameDefinition.name,
      db.default,
      `F00FABE0-0000-0000-0000-000000000001`
    );
    await tournament.start(db.default);

    const scheduler = new Scheduler();
    await scheduler.start();
    const filters = {
      startingAfter: now,
      startingBefore: now.plus({ minutes: 35 }),
    };
    const rounds = await tournament.getRounds(filters, db.default);
    expect(rounds).toHaveLength(2);
    for (const round of rounds) {
      expect(round.status).toEqual(RoundStatus.Created);
    }
    await clock.tickAsync(Duration.fromObject({ minutes: 35 }).toMillis());
    await scheduler.stop();

    const updatedRounds = await tournament.getRounds(filters, db.default);
    for (const round of updatedRounds) {
      expect(round.status).toEqual(RoundStatus.Ended);
    }
  });
});
