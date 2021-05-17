import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
import { TournamentID } from './Tournaments';
import { UserID } from './User';

export type TournamentInvitationID = string;

/* eslint-disable camelcase */
interface DbTournamentInvitation {
  tournament_id: TournamentID;
  user_id: UserID;
}
/* eslint-enable */

export interface TournamentInvivationsSearchOptions {
  tournamentID: TournamentID;
  userID: UserID;
}

export class TournamentInvitation {
  tournamentID: TournamentID;
  userID: UserID;

  constructor(data: DbTournamentInvitation) {
    this.tournamentID = data.tournament_id;
    this.userID = data.user_id;
  }

  static async create(
    tournamentID: TournamentID,
    userID: UserID,
    dbOrTX: DbOrTx
  ): Promise<TournamentInvitation> {
    const query = `INSERT INTO tournament_invitations(tournament_id, user_id)
                   VALUES($[tournamentID], $[userID])
                   RETURNING *`;
    const data = await dbOrTX.one<DbTournamentInvitation>(query, { tournamentID, userID });

    return new TournamentInvitation(data);
  }

  static async delete(tournamentID: TournamentID, userID: UserID, dbOrTX: DbOrTx): Promise<void> {
    const query = `DELETE FROM tournament_invitations
                   WHERE tournament_id = $[tournamentID] AND user_id = $[userID]
                   RETURNING true`;
    await dbOrTX.one<boolean>(query, { tournamentID, userID });
  }

  static async getByID(
    tournamentID: TournamentID,
    userID: UserID,
    dbOrTX: DbOrTx
  ): Promise<TournamentInvitation | null> {
    const data = await dbOrTX.oneOrNone<DbTournamentInvitation>(
      'SELECT * FROM tournament_invitations WHERE tournament_id = $[tournamentID] AND user_id = $[userID]',
      { tournamentID, userID }
    );
    return new TournamentInvitation(data);
  }

  static async getAll(
    filters: TournamentInvivationsSearchOptions,
    dbOrTX: DbOrTx
  ): Promise<TournamentInvitation[]> {
    const queryBuilder = new QueryBuilder(
      'SELECT * FROM tournament_invitations JOIN tournaments ON teams.tournament_id = tournaments.id'
    );
    queryBuilder.orderBy('tournaments.start_date', 'DESC');

    if (filters.tournamentID) {
      queryBuilder.where('tournament_invitations.tournament_id = $[tournamentID]');
    }
    if (filters.userID) {
      queryBuilder.where('tournament_invitations.user_id = $[userID]');
    }

    const rows = await dbOrTX.manyOrNone<DbTournamentInvitation>(queryBuilder.query, filters);
    return rows.map((row) => new TournamentInvitation(row));
  }
}
