import { DateTime } from 'luxon';

import { DbOrTx, DEFAULT } from './db/helpers';
import { Tournament, TournamentID } from './Tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';
import { InvalidArgument } from '~playfulbot/errors';

const PLAYER_PER_GROUP = 5;

export type RoundID = string;

/* eslint-disable camelcase */
interface DbRound {
  id: RoundID;
  status: gqlTypes.RoundStatus;
  ended: boolean;
  start_date: DateTime;
  tournament_id: TournamentID;
}
/* eslint-enable */

export interface RoundsSearchOptions {
  before?: DateTime;
  after?: DateTime;
}

export class Round {
  readonly id: RoundID;
  status: gqlTypes.RoundStatus;
  startDate: DateTime;
  readonly tournamentID: TournamentID;

  constructor(data: DbRound) {
    this.id = data.id;
    this.status = data.status;
    this.startDate = data.start_date;
    this.tournamentID = data.tournament_id;
  }

  static async create(
    startDate: DateTime,
    tournamentID: string,
    dbOrTx: DbOrTx,
    id?: string
  ): Promise<Round> {
    const query = `INSERT INTO rounds(id, start_date, tournament_id)
                   VALUES($[id], $[startDate], $[tournamentID])
                   RETURNING *`;
    const data = await dbOrTx.one<DbRound>(query, {
      startDate: startDate.toJSDate(),
      tournamentID,
      id: id || DEFAULT,
    });
    return new Round(data);
  }

  static async getByID(id: RoundID, dbOrTX: DbOrTx): Promise<Round | null> {
    const data = await dbOrTX.oneOrNone<DbRound | null>('SELECT * FROM rounds WHERE id = $[id]', {
      id,
    });
    if (data !== null) {
      return new Round(data);
    }
    return null;
  }

  static async getRounds(
    tournamentID: RoundID,
    maxSize: number,
    options: RoundsSearchOptions,
    dbOrTX: DbOrTx
  ): Promise<Round[]> {
    let query: string;
    if (options.after) {
      query = `SELECT * FROM rounds WHERE tournament_id = $[tournamentID]
               AND start_date > $[date] ORDER BY start_date ASC LIMIT $[maxSize]`;
    } else if (options.before) {
      query = `SELECT * FROM rounds WHERE tournament_id = $[tournamentID]
               AND start_date < $[date] ORDER BY start_date DESC LIMIT $[maxSize]`;
    } else {
      throw new InvalidArgument('Either "before" or "after" should be set');
    }
    const rows = await dbOrTX.manyOrNone<DbRound>(query, {
      tournamentID,
      maxSize,
      date: options.after || options.before,
    });
    const rounds = rows.map((row) => new Round(row));
    if (options.before) {
      return rounds.reverse();
    }
    return rounds;
  }

  // async start(dbOrTX: DbOrTx) {
  //   const tournament = await this.getTournament(dbOrTX);
  //   const teams = await tournament.getTeams(dbOrTX);
  //   const players = teams.map((team) => team.getTournamentPlayer());
  //   const connectedPlayers = players.filter((player) => player.connected);
  // }

  getTournament(dbOrTX: DbOrTx): Promise<Tournament> {
    return Tournament.getByID(this.tournamentID, dbOrTX);
  }
}
