import { DateTime } from 'luxon';

import { DbOrTx, DEFAULT } from './db/helpers';
import { Tournament, TournamentID } from './Tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';

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

export class Round {
  readonly id: RoundID;
  status: gqlTypes.RoundStatus;
  startDate: DateTime;
  readonly tournamentID: TournamentID;

  private constructor(data: DbRound) {
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

  static async getByTournamentID(tournamentID: RoundID, dbOrTX: DbOrTx): Promise<Round[]> {
    const rows = await dbOrTX.manyOrNone<DbRound>(
      'SELECT * FROM rounds WHERE tournament_id = $[tournamentID] ORDER BY start_date ASC',
      { tournamentID }
    );
    return rows.map((row) => new Round(row));
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
