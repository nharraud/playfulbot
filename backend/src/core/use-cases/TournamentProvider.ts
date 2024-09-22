import { DateTime } from 'luxon';
// import { BackendGameDefinition } from 'playfulbot-game-backend';
// import { ConflictError, InvalidArgument } from '~playfulbot/errors';
// import logger from '~playfulbot/logging';

// import { getGameDefinitions } from '~playfulbot/games';
// import { scheduler, Scheduler } from '~playfulbot/scheduling/Scheduler';
import { Tournament, TournamentID, TournamentStatus } from '../entities/Tournaments';
import { UserID } from '../entities/Users';
import { GameDefinitionID } from 'playfulbot-config-loader';


interface GetAllTournamentsFilters {
  status?: TournamentStatus;
  startingAfter?: string;
  startingBefore?: string;
  invitedUserID?: UserID;
  organizingUserID?: UserID;
}

function computeFirstRoundDate(
  lastRoundDate: DateTime,
  minutesBetweenRounds: number,
  roundsNumber: number
): DateTime {
  return lastRoundDate.minus({
    minutes: minutesBetweenRounds * (roundsNumber - 1),
  });
}

export interface TournamentProvider<Context> {

  createTournament(
    ctx: Context,
    params: {
      name: string,
      startDate: string,
      lastRoundDate: string,
      roundsNumber: number,
      minutesBetweenRounds: number,
      gameDefinitionId: GameDefinitionID,
      id?: TournamentID
    }
  ): Promise<Tournament>;

  // getTournamentByID(ctx: Context, id: TournamentID): Promise<Tournament | null>;

  // getTournamentByTeam(ctx: Context, teamID: TeamID): Promise<Tournament | null>;

  // getTournamentByInvitationLink(
  //   ctx: Context, 
  //   tournamentInvitationLinkID: TournamentInvitationLinkID
  // ): Promise<Tournament | null>;

  // tournamentExists(id: TournamentID, dbOrTX: DbOrTx): Promise<boolean>;

  // getAllTournaments(
  //   ctx: Context, 
  //   filters: GetAllTournamentsFilters
  // ): Promise<Tournament[]>;

  // isTournamentOrganizer(
  //   ctx: Context, 
  //   tournamentID: TournamentID,
  //   userID: UserID
  // ): Promise<boolean>;

  // startTournament(ctx: Context, tournamentID: TournamentID): Promise<void>;

  // getRounds(ctx: Context, tournamentID: TournamentID, filters: RoundsSearchOptions): Promise<Round[]>;

  // getNextRound(ctx: Context, tournamentID: TournamentID): Promise<Round | null>;

  // getTeams(ctx: Context, tournamentID: TournamentID): Promise<Team[]>;

  // getGameDefinition(tournamentID: TournamentID): Promise<BackendGameDefinition>;

  // get firstRoundDate(): DateTime;

  // get nextRoundDate(): DateTime;

  // getInvitationLink(ctx: Context): Promise<TournamentInvitationLink>;

  // addRole(ctx: Context, userID: UserID, role: TournamentRoleName): Promise<void>;

  // getUserRole(ctx: Context, userID: UserID): Promise<TournamentRoleName | null>;
}
