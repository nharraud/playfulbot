import { TournamentID } from "./Tournaments";
import { expectString } from "./Validation";

export type TeamID = string;

export interface Team {
  id: TeamID;
  tournamentId: TournamentID;
  name: string;
};

export function validateTeamName(username: string) {
  return expectString(username, { min: 3, max: 15 });
}