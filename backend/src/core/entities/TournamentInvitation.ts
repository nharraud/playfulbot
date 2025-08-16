import { TournamentID } from "./Tournaments";
import { UserID } from "./Users";

export interface TournamentInvitation {
  tournamentId: TournamentID,
  inviteeId: UserID,
  sentAt: string,
};

export function isTournamentInvitation(value: any): value is TournamentInvitation {
  return value?.tournamentId && value.inviteeId && value.sentAt;
}