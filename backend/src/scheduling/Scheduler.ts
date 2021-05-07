import { DateTime, Duration } from 'luxon';
import logger from '~playfulbot/logging';
import { db } from '~playfulbot/model/db';
import { fixTimeParsing } from '~playfulbot/model/db/fixTimeParsing';
import { DbOrTx } from '~playfulbot/model/db/helpers';
import { Round, RoundStatus } from '~playfulbot/model/Round';
import { Tournament, TournamentID, TournamentStatus } from '~playfulbot/model/Tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';

export class Scheduler {
  private static readonly SCHEDULE_WINDOW = Duration.fromISOTime('00:15');
  private readonly timeouts = new Set<NodeJS.Timeout>();
  private readonly jobs = new Set<Promise<any>>();
  private stopped = false;

  start(): Promise<void> {
    logger.info('Starting scheduler');
    const job = this.scheduleNextWindow().then(() => {
      logger.info('Scheduler started');
      this.jobs.delete(job);
    });
    this.jobs.add(job);
    return job;
  }

  async stop(): Promise<void> {
    this.stopped = true;
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
    this.timeouts.clear();
    await this.waitOnJobs();
  }

  async waitOnJobs(): Promise<void> {
    while (this.jobs.size > 0) {
      await Promise.all([...this.jobs]);
    }
  }

  private async scheduleNextWindow() {
    if (this.stopped) {
      return;
    }
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
    const windowStart = DateTime.now();
    const windowEnd = windowStart.plus(Scheduler.SCHEDULE_WINDOW);
    const timeout = setTimeout(() => {
      if (this.stopped) {
        return;
      }
      const job = this.scheduleNextWindow()
        .catch((error) => {
          logger.error(error);
          throw error;
        })
        .then(() => {
          this.jobs.delete(job);
        });
      this.jobs.add(job);
      this.timeouts.delete(timeout);
    }, Scheduler.SCHEDULE_WINDOW.toMillis());
    this.timeouts.add(timeout);

    await Scheduler.startMissedTournaments(windowStart);
    await this.scheduleNextTournaments(windowStart, windowEnd);
    await this.startMissedRounds(windowStart);
    await this.scheduleNextRounds(windowStart, windowEnd);
  }

  static async startMissedTournaments(now: DateTime): Promise<void> {
    const createdTournaments = await Tournament.getAll(
      { startingBefore: now, status: TournamentStatus.Created },
      db.default
    );
    await Promise.all(createdTournaments.map((tournament) => tournament.start(db.default)));
  }

  async scheduleNextTournaments(now: DateTime, windowEnd: DateTime): Promise<void> {
    const tournaments = await Tournament.getAll(
      { startingAfter: now, startingBefore: windowEnd, status: TournamentStatus.Created },
      db.default
    );
    tournaments.forEach((tournament) => this.scheduleTournament(tournament));
  }

  scheduleTournament(tournament: Tournament): void {
    if (this.stopped) {
      return;
    }
    const now = DateTime.now();
    if (tournament.startDate <= now.plus(Scheduler.SCHEDULE_WINDOW)) {
      const timeout = setTimeout(() => {
        if (this.stopped) {
          return;
        }
        const job = tournament
          .start(db.default)
          .catch((error) => {
            logger.error(error);
            throw error;
          })
          .then(() => {
            this.jobs.delete(job);
          });
        this.jobs.add(job);
        this.timeouts.delete(timeout);
      }, tournament.startDate.diffNow().valueOf());
      this.timeouts.add(timeout);
    }
  }

  async startMissedRounds(now: DateTime): Promise<void> {
    const createdRounds = await Round.getAll(
      { startingBefore: now, status: RoundStatus.Created },
      db.default
    );
    await Promise.all(
      createdRounds.map(async (round) => {
        await round.start(db.default);
        const job = round?.roundEndPromise?.then(() => {
          this.jobs.delete(job);
        });
        if (job !== undefined) {
          this.jobs.add(job);
        }
      })
    );
  }

  async scheduleNextRounds(now: DateTime, windowEnd: DateTime): Promise<void> {
    const rounds = await Round.getAll(
      { startingAfter: now, startingBefore: windowEnd, status: RoundStatus.Created },
      db.default
    );
    rounds.forEach((round) => this.scheduleRound(round));
  }

  scheduleRound(round: Round): void {
    if (this.stopped) {
      return;
    }
    const now = DateTime.now();
    if (round.startDate <= now.plus(Scheduler.SCHEDULE_WINDOW)) {
      const timeout = setTimeout(() => {
        if (this.stopped) {
          return;
        }
        const job = round
          .start(db.default)
          .then(() => round?.roundEndPromise)
          .catch((error) => {
            logger.error(error);
            throw error;
          })
          .then(() => {
            this.jobs.delete(job);
          });
        this.jobs.add(job);
        this.timeouts.delete(timeout);
      }, round.startDate.diffNow().valueOf());
      this.timeouts.add(timeout);
    }
  }
}

export const scheduler = new Scheduler();
