import { TournamentID } from "./Tournaments";
import { UserID } from "./Users";

export interface TournamentInvitation {
  tournamentId: TournamentID;
  userId: UserID;
};
