import { DateTime } from 'luxon';
import { ConflictError, InvalidArgument } from '~playfulbot/errors';

import { DbOrTx, DEFAULT } from './db/helpers';
import { GameDefinition, gameDefinitions } from './GameDefinition';
import { Round } from './Round';
import { Team } from './Team';

export type TournamentID = string;

/* eslint-disable camelcase */
interface DbTournament {
  readonly id: TournamentID;
  name: string;
  started: boolean;
  ended: boolean;
  start_date: DateTime;
  last_round_date: DateTime;
  rounds_number: number;
  minutes_between_rounds: number;
  game_name: string;
}
/* eslint-enable */

export class Tournament {
  readonly id: TournamentID;
  name: string;
  started: boolean;
  ended: boolean;
  startDate: DateTime;
  lastRoundDate: DateTime;
  roundsNumber: number;
  minutesBetweenRounds: number;
  gameName: string;

  private constructor(data: DbTournament) {
    this.id = data.id;
    this.name = data.name;
    this.started = data.started;
    this.ended = data.ended;
    this.startDate = data.start_date;
    this.lastRoundDate = data.last_round_date;
    this.roundsNumber = data.rounds_number;
    this.gameName = data.game_name;
    this.minutesBetweenRounds = data.minutes_between_rounds;
  }

  static async create(
    name: string,
    startDate: DateTime,
    lastRoundDate: DateTime,
    roundsNumber: number,
    minutesBetweenRounds: number,
    gameName: string,
    dbOrTX: DbOrTx,
    id?: TournamentID
  ): Promise<Tournament> {
    if (lastRoundDate < DateTime.now()) {
      throw new InvalidArgument('Cannot create a Tournament with a last round date in the past');
    }

    if (!gameDefinitions.has(gameName)) {
      throw new InvalidArgument('Invalid game name');
    }

    const query = `INSERT INTO tournaments(id, name, start_date, last_round_date, rounds_number, minutes_between_rounds, game_name)
    VALUES($[id], $[name], $[startDate], $[lastRoundDate], $[roundsNumber], $[minutesBetweenRounds], $[gameName])
    RETURNING *`;
    const data = await dbOrTX.one<DbTournament>(query, {
      name,
      startDate,
      lastRoundDate,
      roundsNumber,
      minutesBetweenRounds,
      gameName,
      id: id || DEFAULT,
    });
    return new Tournament(data);
  }

  static async getByID(id: TournamentID, dbOrTX: DbOrTx): Promise<Tournament | null> {
    const data = await dbOrTX.oneOrNone<DbTournament>(
      'SELECT * FROM tournaments WHERE id = $[id]',
      {
        id,
      }
    );
    if (data !== null) {
      return new Tournament(data);
    }
    return null;
  }

  static async exists(id: TournamentID, dbOrTX: DbOrTx): Promise<boolean> {
    return dbOrTX.oneOrNone<boolean>('SELECT EXISTS(SELECT 1 FROM tournaments WHERE id = $[id])', {
      id,
    });
  }

  static async getAll(dbOrTX: DbOrTx): Promise<Tournament[]> {
    const rows = await dbOrTX.manyOrNone<DbTournament>('SELECT * FROM tournaments');
    return rows.map((row) => new Tournament(row));
  }

  async start(dbOrTX: DbOrTx): Promise<void> {
    if (DateTime.now() < this.startDate) {
      throw new ConflictError('Tournament cannot be started before its startDate date');
    }

    await dbOrTX.tx(async (tx) => {
      await tx.none('UPDATE tournaments SET started = true WHERE id = $[id]', { id: this.id });
      this.started = true;

      const roundPromises = new Array(this.roundsNumber)
        .fill(0)
        .map((_, index) =>
          Round.create(
            this.lastRoundDate.minus({ minutes: this.minutesBetweenRounds * index }),
            this.id,
            tx
          )
        );
      await Promise.all(roundPromises);
    });
  }

  getRounds(dbOrTX: DbOrTx): Promise<Round[]> {
    return Round.getByTournamentID(this.id, dbOrTX);
  }

  getTeams(dbOrTX: DbOrTx): Promise<Team[]> {
    return Team.getByTournamentID(this.id, dbOrTX);
  }

  getGameDefinition(): GameDefinition {
    return gameDefinitions.get(this.gameName);
  }
}
