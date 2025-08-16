// import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
// import { Tournament, TournamentID, DbTournament } from '../infrastructure/TournamentProviderPSQL';
// import { User, UserID } from '../infrastructure/UserProviderPSQL';

import { TournamentInvitationProvider, TournamentInvivationsSearchOptions } from '~playfulbot/core/use-cases/interfaces/TournamentInvitiationProvider';
import { TournamentInvitation } from '~playfulbot/core/entities/TournamentInvitation';
import { TournamentID } from '~playfulbot/core/entities/Tournaments';
import { UserID } from '~playfulbot/core/entities/Users';
import { ContextPSQL } from './ContextPSQL';
import { QueryBuilder } from 'playfulbot-backend-commons/lib/model/db/helpers';

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
interface DbTournamentInvitation {
  tournament_id: TournamentID,
  invitee_id: UserID,
  sent_at: string,
}
/* eslint-enable */

function buildTournamentInvitation(data: DbTournamentInvitation): TournamentInvitation {
  const result: TournamentInvitation = {
    tournamentId: data.tournament_id,
    inviteeId: data.invitee_id,
    sentAt: data.sent_at,
  };
  return result;
}


export class TournamentInvitationProviderPSQL implements TournamentInvitationProvider<ContextPSQL> {

  async createTournamentInvitation(
    ctx: ContextPSQL,
    { tournamentId, inviteeId }: {
      tournamentId: TournamentID,
      inviteeId: UserID,
    }
  ): Promise<TournamentInvitation> {
    const query = `INSERT INTO tournament_invitations(tournament_id, invitee_id)
                   VALUES($[tournamentId], $[inviteeId])
                   RETURNING *`;
    const data = await ctx.dbOrTx.one<DbTournamentInvitation>(query, {
      tournamentId,
      inviteeId,
    });
    return buildTournamentInvitation(data);
  }

  async deleteTournamentInvitation(
    ctx: ContextPSQL,
    { tournamentId, inviteeId }: {
      tournamentId: TournamentID,
      inviteeId: UserID,
    }): Promise<void> {
    const query = `DELETE FROM tournament_invitations
                   WHERE tournament_id = $[tournamentId] AND invitee_id = $[inviteeId]
                   RETURNING true`;
    await ctx.dbOrTx.oneOrNone<{ bool: boolean }>(query, { tournamentId, inviteeId });
  }

  async isInvited(
    ctx: ContextPSQL,
    { tournamentId, inviteeId }: {
      tournamentId: TournamentID,
      inviteeId: UserID,
    }): Promise<boolean> {
    const result = await ctx.dbOrTx.oneOrNone<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM tournament_invitations WHERE tournament_id = $[tournamentId] AND invitee_id = $[inviteeId]
       )`,
      {
        tournamentId,
        inviteeId,
      }
    );
    return result.exists || false;
  }

  async getAll(
    ctx: ContextPSQL,
    filters: TournamentInvivationsSearchOptions
  ): Promise<TournamentInvitation[]> {
    const queryBuilder = new QueryBuilder(
      'SELECT tournament_invitations.* FROM tournament_invitations'
    );

    if (filters.tournamentId) {
      queryBuilder.where('tournament_invitations.tournament_id = $[tournamentId]');
    }
    if (filters.inviteeId) {
      queryBuilder.where('tournament_invitations.invitee_id = $[inviteeId]');
    }

    const rows = await ctx.dbOrTx.manyOrNone<DbTournamentInvitation>(
      queryBuilder.query,
      filters
    );
    return rows.map((row) => buildTournamentInvitation(row));
  }
}
