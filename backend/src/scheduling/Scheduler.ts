import { DateTime, Duration } from 'luxon';
import logger from '~playfulbot/logging';
import { db } from '~playfulbot/model/db';
import { fixTimeParsing } from '~playfulbot/model/db/fixTimeParsing';
import { DbOrTx } from '~playfulbot/model/db/helpers';
import { Tournament, TournamentID } from '~playfulbot/model/Tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';

export class Scheduler {
  private static readonly SCHEDULE_WINDOW = Duration.fromISOTime('01:00');
  private readonly timeouts = new Set<NodeJS.Timeout>();
  private readonly jobs = new Set<Promise<any>>();

  start(): Promise<void> {
    const job = this.scheduleNextWindow().then(() => {
      this.jobs.delete(job);
    });
    this.jobs.add(job);
    return job;
  }

  async stop(): Promise<void> {
    await this.waitOnJobs();
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
  }

  async waitOnJobs(): Promise<void> {
    while (this.jobs.size > 0) {
      await Promise.all([...this.jobs]);
    }
  }

  private async scheduleNextWindow() {
    const windowStart = DateTime.now();
    const windowEnd = windowStart.plus(Scheduler.SCHEDULE_WINDOW);
    const timeout = setTimeout(() => {
      const job = this.scheduleNextWindow()
        .catch((error) => logger.error(error))
        .then(() => {
          this.jobs.delete(job);
        });
      this.jobs.add(job);
    }, Scheduler.SCHEDULE_WINDOW.toMillis());
    this.timeouts.add(timeout);

    return db.default.tx(async (tx) => {
      await Scheduler.startMissedTournaments(windowStart, tx);
      await this.scheduleNextTournaments(windowStart, windowEnd, tx);
    });
  }

  static async startMissedTournaments(now: DateTime, dbOrTx: DbOrTx): Promise<void> {
    const createdTournaments = await Tournament.getAll(
      { startingBefore: now, status: gqlTypes.TournamentStatus.Created },
      dbOrTx
    );
    await Promise.all(createdTournaments.map((tournament) => tournament.start(dbOrTx)));
  }

  async scheduleNextTournaments(now: DateTime, windowEnd: DateTime, dbOrTx: DbOrTx): Promise<void> {
    const tournaments = await Tournament.getAll(
      { startingAfter: now, startingBefore: windowEnd, status: gqlTypes.TournamentStatus.Created },
      dbOrTx
    );
    tournaments.forEach((tournament) => this.scheduleTournament(tournament));
  }

  scheduleTournament(tournament: Tournament): void {
    const now = DateTime.now();
    if (tournament.startDate <= now.plus(Scheduler.SCHEDULE_WINDOW)) {
      const timeout = setTimeout(() => {
        const job = tournament
          .start(db.default)
          .catch((error) => logger.error(error))
          .then(() => {
            this.jobs.delete(job);
          });
        this.jobs.add(job);
        this.timeouts.delete(timeout);
      }, tournament.startDate.diffNow().valueOf());
      this.timeouts.add(timeout);
    }
  }
}

export const scheduler = new Scheduler();
