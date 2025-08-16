// import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
// import { Tournament, TournamentID, DbTournament } from '../infrastructure/TournamentProviderPSQL';
// import { User, UserID } from '../infrastructure/UserProviderPSQL';

import { TournamentInvitation } from "~playfulbot/core/entities/TournamentInvitation";
import { TournamentID } from "~playfulbot/core/entities/Tournaments";
import { UserID } from "~playfulbot/core/entities/Users";

export interface TournamentInvivationsSearchOptions {
  tournamentId?: TournamentID,
  inviteeId?: UserID,
}

export interface TournamentInvitationProvider<Context> {

  createTournamentInvitation(
    ctx: Context,
    params: {
      tournamentId: TournamentID,
      inviteeId: UserID,
    }
  ): Promise<TournamentInvitation>;

  deleteTournamentInvitation(
    ctx: Context,
    params: {
      tournamentId: TournamentID,
      inviteeId: UserID,
    }
  ): Promise<void>;

  isInvited(
    ctx: Context,
    params: {
      tournamentId: TournamentID,
      inviteeId: UserID,
    }
  ): Promise<boolean>;

  getAll(
    ctx: Context,
    filters: TournamentInvivationsSearchOptions
  ): Promise<TournamentInvitation[]>;
}
