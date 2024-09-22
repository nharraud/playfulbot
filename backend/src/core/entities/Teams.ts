import { TournamentID } from "./Tournaments";

export type TeamID = string;

export interface Team {
  id: TeamID;
  tournamentId: TournamentID;
  name: string;
};
