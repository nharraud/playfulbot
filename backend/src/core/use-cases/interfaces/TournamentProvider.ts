import { DateTime } from 'luxon';
// import { BackendGameDefinition } from 'playfulbot-game-backend';
// import { ConflictError, InvalidArgument } from '~playfulbot/errors';
// import logger from '~playfulbot/logging';

// import { getGameDefinitions } from '~playfulbot/games';
// import { scheduler, Scheduler } from '~playfulbot/scheduling/Scheduler';
import { Tournament, TournamentID, TournamentStatus } from '~playfulbot/core/entities/Tournaments';
import { UserID } from '~playfulbot/core/entities/Users';
import { GameDefinitionID } from 'playfulbot-config-loader';
import { TeamID } from '~playfulbot/core/entities/Teams';
import { TournamentRole } from '~playfulbot/core/entities/TournamentRole';


export interface GetAllTournamentsFilters {
  // status?: TournamentStatus;
  // startingAfter?: string;
  // startingBefore?: string;
  // invitedUserID?: UserID;
  userRole?: { userId: UserID, role: TournamentRole }
}

export type GetAllTournamentsOrderings = 'name';

// function computeFirstRoundDate(
//   lastRoundDate: DateTime,
//   minutesBetweenRounds: number,
//   roundsNumber: number
// ): DateTime {
//   return lastRoundDate.minus({
//     minutes: minutesBetweenRounds * (roundsNumber - 1),
//   });
// }

export interface TournamentProvider<Context> {

  createTournament(
    ctx: Context,
    params: {
      name: string,
      startDate: Date | string,
      endDate: Date | string,
      config?: string | object,
      gameDefinitionId: GameDefinitionID,
      id?: TournamentID
    }
  ): Promise<Tournament>;

  getTournamentByID(ctx: Context, id: TournamentID): Promise<Tournament | null>;

  getTournamentByTeam(ctx: Context, teamID: TeamID): Promise<Tournament | null>;

  getUserRole(ctx: Context, params: { tournamentId: TournamentID, userId: UserID }): Promise<TournamentRole | null>;

  /**
   * Add or remove role for a given tournament and user.
   * Providing a null role means unsetting any role the user might have had
   */
  changeTournamentRole(ctx: Context, params: { tournamentId: TournamentID, userId: UserID, role: TournamentRole | null }):
    Promise<void>;

  /**
   * Retrieve a set of tournaments for a given user and a role.
   * If no role is provided, every tournament where the user has a role are returned.
   */
  // getTournamentsByRole(ctx: Context, params: { userId: UserID, role: TournamentRole | undefined }):
  //   Promise<{ tournament: Tournament, role: TournamentRole }[]>;

  // getTournamentByInvitationLink(
  //   ctx: Context, 
  //   tournamentInvitationLinkID: TournamentInvitationLinkID
  // ): Promise<Tournament | null>;

  tournamentExists(ctx: Context, id: TournamentID): Promise<boolean>;

  getAllTournaments(
    ctx: Context,
    params: {
      filters?: GetAllTournamentsFilters,
      limit?: number,
      offset?: number,
      order?: { field: GetAllTournamentsOrderings, direction: 'ASC' | 'DESC' }
    }
  ): Promise<Tournament[]>;

  // isTournamentOrganizer(
  //   ctx: Context, 
  //   tournamentID: TournamentID,
  //   userID: UserID
  // ): Promise<boolean>;

  startTournament(ctx: Context, tournamentID: TournamentID): Promise<boolean>;

  // getRounds(ctx: Context, tournamentID: TournamentID, filters: RoundsSearchOptions): Promise<Round[]>;

  // getNextRound(ctx: Context, tournamentID: TournamentID): Promise<Round | null>;

  // getTeams(ctx: Context, tournamentID: TournamentID): Promise<Team[]>;

  // getGameDefinition(tournamentID: TournamentID): Promise<BackendGameDefinition>;

  // get firstRoundDate(): DateTime;

  // get nextRoundDate(): DateTime;

  // getInvitationLink(ctx: Context): Promise<TournamentInvitationLink>;

  // addRole(ctx: Context, userID: UserID, role: TournamentRoleName): Promise<void>;

}
