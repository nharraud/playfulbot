export type UserID = string;
export type TournamentID = string;
export type TeamID = string;

export interface DbUser {
  id: UserID;
  username: string;
  password: Buffer;
}

export interface DbTournament {
  id: TournamentID;
  name: string;
}

export interface DbTeam {
  id: TeamID;
  name: string;
}
