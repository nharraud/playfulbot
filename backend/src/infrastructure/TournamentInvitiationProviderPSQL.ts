// import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
// import { Tournament, TournamentID, DbTournament } from '../infrastructure/TournamentProviderPSQL';
// import { User, UserID } from '../infrastructure/UserProviderPSQL';

import { TournamentInvitationProvider } from '~playfulbot/core/use-cases/TournamentInvitiationProvider';
import { TournamentInvitation } from '~playfulbot/core/entities/TournamentInvitation';
import { TournamentID } from '~playfulbot/core/entities/Tournaments';
import { UserID } from '~playfulbot/core/entities/Users';
import { ContextPSQL } from './ContextPSQL';

// export type TournamentInvitationID = string;

/* eslint-disable camelcase */
// interface DbTournamentInvitation {
//   tournament_id: TournamentID;
//   user_id: UserID;
// }
/* eslint-enable */

// export interface TournamentInvivationsSearchOptions {
//   tournamentID?: TournamentID;
//   userID?: UserID;
// }


/* eslint-disable camelcase */
export interface DbTournamentInvitation {
  readonly tournament_id: TournamentID;
  readonly user_id: UserID;
}
/* eslint-enable */

function buildTournamentInvitation(data: DbTournamentInvitation): TournamentInvitation {
  return {
    tournamentId: data.tournament_id,
    userId: data.user_id,
  }
}


export class TournamentInvitationProviderPSQL implements TournamentInvitationProvider<ContextPSQL> {

  async createTournamentInvitation(
    ctx: ContextPSQL,
    { tournamentId, userId }: {
      tournamentId: TournamentID,
      userId: UserID,
    }
  ): Promise<TournamentInvitation> {
    const query = `INSERT INTO tournament_invitations(tournament_id, user_id)
                   VALUES($[tournamentId], $[userId])
                   RETURNING *`;
    const data = await ctx.dbOrTx.one<DbTournamentInvitation>(query, {
      tournamentId,
      userId,
    });
    return buildTournamentInvitation(data);
  }

  async deleteTournamentInvitation(
    ctx: ContextPSQL,
    { tournamentId, userId }: {
      tournamentId: TournamentID,
      userId: UserID,
    }): Promise<void> {
    const query = `DELETE FROM tournament_invitations
                   WHERE tournament_id = $[tournamentId] AND user_id = $[userId]
                   RETURNING true`;
    await ctx.dbOrTx.oneOrNone<{ bool: boolean }>(query, { tournamentId, userId });
  }

  async isInvited(
    ctx: ContextPSQL,
    { tournamentId, userId }: {
      tournamentId: TournamentID,
      userId: UserID,
    }): Promise<boolean> {
    const result = await ctx.dbOrTx.oneOrNone<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM tournament_invitations WHERE tournament_id = $[tournamentId] AND user_id = $[userId]
       )`,
      {
        tournamentId,
        userId,
      }
    );
    return result.exists || false;
  }

  // static async getByID(
  //   tournamentID: TournamentID,
  //   userID: UserID,
  //   dbOrTX: DbOrTx
  // ): Promise<TournamentInvitation | null> {
  //   const data = await dbOrTX.oneOrNone<DbTournamentInvitation>(
  //     'SELECT * FROM tournament_invitations WHERE tournament_id = $[tournamentID] AND user_id = $[userID]',
  //     { tournamentID, userID }
  //   );
  //   return new TournamentInvitation(data);
  // }

  // static async getAll(
  //   filters: TournamentInvivationsSearchOptions,
  //   dbOrTX: DbOrTx
  // ): Promise<TournamentInvitation[]> {
  //   const queryBuilder = new QueryBuilder(
  //     'SELECT tournament_invitations.*, tournaments.* FROM tournament_invitations JOIN tournaments ON tournament_invitations.tournament_id = tournaments.id'
  //   );
  //   queryBuilder.orderBy('tournaments.start_date', 'DESC');

  //   if (filters.tournamentID) {
  //     queryBuilder.where('tournament_invitations.tournament_id = $[tournamentID]');
  //   }
  //   if (filters.userID) {
  //     queryBuilder.where('tournament_invitations.user_id = $[userID]');
  //   }

  //   const rows = await dbOrTX.manyOrNone<DbTournamentInvitation & DbTournament>(
  //     queryBuilder.query,
  //     filters
  //   );
  //   return rows.map((row) => new TournamentInvitation(row, new Tournament(row)));
  // }

  // async getTournament(dbOrTX: DbOrTx): Promise<Tournament> {
  //   if (!this._tournament) {
  //     this._tournament = await Tournament.getByID(this.tournamentID, dbOrTX);
  //   }
  //   return this._tournament;
  // }

  // async getUser(dbOrTX: DbOrTx): Promise<User> {
  //   if (!this._user) {
  //     this._user = await User.getByID(this.userID, dbOrTX);
  //   }
  //   return this._user;
  // }

  // get id(): TournamentInvitationID {
  //   // FIXME: could be more efficient if we used base64url
  //   return `${this.tournamentID}:${this.userID}`;
  // }
}
