import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
import { Tournament, TournamentID, DbTournament } from '../infrastructure/TournamentProviderPSQL';
import { User, UserID } from '../infrastructure/UserProviderPSQL';

export type TournamentInvitationID = string;

/* eslint-disable camelcase */
interface DbTournamentInvitation {
  tournament_id: TournamentID;
  user_id: UserID;
}
/* eslint-enable */

export interface TournamentInvivationsSearchOptions {
  tournamentID?: TournamentID;
  userID?: UserID;
}

export class TournamentInvitation {
  tournamentID: TournamentID;
  userID: UserID;
  _tournament: Tournament;
  _user: User;

  constructor(data: DbTournamentInvitation, tournament?: Tournament) {
    this.tournamentID = data.tournament_id;
    this.userID = data.user_id;
    this._tournament = tournament;
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
    await dbOrTX.oneOrNone<{ bool: boolean }>(query, { tournamentID, userID });
  }

  static async isInvited(
    tournamentID: TournamentID,
    userID: UserID,
    dbOrTX: DbOrTx
  ): Promise<boolean> {
    const result = await dbOrTX.oneOrNone<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM tournament_invitations WHERE tournament_id = $[tournamentID] AND user_id = $[userID]
       )`,
      {
        tournamentID,
        userID,
      }
    );
    return result.exists || false;
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
      'SELECT tournament_invitations.*, tournaments.* FROM tournament_invitations JOIN tournaments ON tournament_invitations.tournament_id = tournaments.id'
    );
    queryBuilder.orderBy('tournaments.start_date', 'DESC');

    if (filters.tournamentID) {
      queryBuilder.where('tournament_invitations.tournament_id = $[tournamentID]');
    }
    if (filters.userID) {
      queryBuilder.where('tournament_invitations.user_id = $[userID]');
    }

    const rows = await dbOrTX.manyOrNone<DbTournamentInvitation & DbTournament>(
      queryBuilder.query,
      filters
    );
    return rows.map((row) => new TournamentInvitation(row, new Tournament(row)));
  }

  async getTournament(dbOrTX: DbOrTx): Promise<Tournament> {
    if (!this._tournament) {
      this._tournament = await Tournament.getByID(this.tournamentID, dbOrTX);
    }
    return this._tournament;
  }

  async getUser(dbOrTX: DbOrTx): Promise<User> {
    if (!this._user) {
      this._user = await User.getByID(this.userID, dbOrTX);
    }
    return this._user;
  }

  get id(): TournamentInvitationID {
    // FIXME: could be more efficient if we used base64url
    return `${this.tournamentID}:${this.userID}`;
  }
}
