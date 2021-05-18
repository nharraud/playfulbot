import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { db } from '~playfulbot/model/db';
import { DbOrTx, DEFAULT } from './db/helpers';
import { TeamID } from './Team';
import { TournamentID } from './Tournaments';
import { UserID } from './User';
import { TournamentInvitation } from './TournamentInvitation';

export type TournamentInvitationLinkID = string;

/* eslint-disable camelcase */
interface DbTournamentInvitationLink {
  id: TournamentInvitationLinkID;
  tournament_id: TournamentID;
}
/* eslint-enable */

export class TournamentInvitationLink {
  id: TournamentInvitationLinkID;
  tournamentID: TournamentID;

  constructor(data: DbTournamentInvitationLink) {
    this.id = data.id;
    this.tournamentID = data.tournament_id;
  }

  static async create(
    tournamentID: TournamentID,
    dbOrTX: DbOrTx,
    id?: TournamentInvitationLinkID
  ): Promise<TournamentInvitationLink> {
    const query = `INSERT INTO tournament_invitation_links(id, tournament_id)
                   VALUES($[id], $[tournamentID])
                   RETURNING *`;
    const data = await dbOrTX.one<DbTournamentInvitationLink>(query, {
      tournamentID,
      id: id || DEFAULT,
    });

    return new TournamentInvitationLink(data);
  }

  static async getByID(
    id: TournamentInvitationLinkID,
    dbOrTX: DbOrTx
  ): Promise<TournamentInvitationLink | null> {
    const data = await dbOrTX.oneOrNone<DbTournamentInvitationLink>(
      'SELECT * FROM tournament_invitation_links WHERE id = $[id]',
      { id }
    );
    return new TournamentInvitationLink(data);
  }

  static async getAll(
    tournamentID: TournamentID,
    dbOrTX: DbOrTx
  ): Promise<TournamentInvitationLink[]> {
    const rows = await dbOrTX.manyOrNone<DbTournamentInvitationLink>(
      'SELECT * FROM tournament_invitation_links WHERE tournament_id = $[tournamentID]',
      { tournamentID }
    );
    return rows.map((row) => new TournamentInvitationLink(row));
  }

  async registerInvitationForUser(userID: UserID, dbOrTX: DbOrTx): Promise<TournamentInvitation> {
    // This method will be especially useful later when we make single-use links.
    return TournamentInvitation.create(this.tournamentID, userID, dbOrTX);
  }
}
