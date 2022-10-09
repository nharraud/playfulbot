import { DateTime, Duration } from 'luxon';
import FakeTimers from '@sinonjs/fake-timers';
import { db } from '~playfulbot/model/db';
import { config } from '~playfulbot/model/db/config';
import { createDB, dropDB } from '~playfulbot/model/db/db_admin';
import { Tournament, TournamentStatus } from '~playfulbot/model/Tournaments';
import { Scheduler } from './Scheduler';
import { RoundStatus } from '~playfulbot/model/Round';
import { User } from '~playfulbot/model/User';
import { tournamentAdminFixture } from '~playfulbot/model/__tests__/fixtures/tournamentFixtures';
import { resetFixtures } from '~playfulbot/model/__tests__/fixtures/reset';
import { gameDefinition } from '~playfulbot/games/__tests__/fixtures/testgame';

jest.mock('~playfulbot/games');

describe('Scheduler', () => {
  let oldDatabaseName: string;
  let clock: FakeTimers.InstalledClock;
  let admin: User;

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

    admin = await tournamentAdminFixture();
  });

  afterEach(async () => {
    await dropDB();
    resetFixtures();
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
      admin.id,
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
      admin.id,
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
