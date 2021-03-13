import { GameState } from '~playfulbot/types/gameState';
import { JWToken } from './token';

export type UserID = string;
export type TournamentID = string;
export type PlayerID = string;
export type TeamID = string;
export type GameID = string;
export type GameScheduleID = string;

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

export interface DbPlayerAssignment {
  playerID: PlayerID;
  userID?: UserID;
  playerNumber: number;
}

export interface DbGame<GS extends GameState> {
  id: GameID;
  version: number;
  assignments: DbPlayerAssignment[];
  gameState: GS;
  gameSchedules: GameScheduleID[];
}

export interface DbGamePatch {
  gameID: GameID;
  version: number;
  patch: JSON;
}

export interface DbPlayer {
  id: PlayerID;
  token: JWToken;
}

export interface DbGameSchedule<GS extends GameState> {
  id: GameScheduleID;
  game?: DbGame<GS>;
  players: DbPlayer[];
}
