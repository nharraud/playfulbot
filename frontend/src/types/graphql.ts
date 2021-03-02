import { GameState } from 'src/types/gameState';

export type UserID = string;
export type PlayerID = string;
export type TeamID = string;
export type GameID = string;
export type GameScheduleID = string;
export type JWToken = string;

export interface User {
  id: UserID;
  username: string;
}

export interface Team {
  id: TeamID;
  name: string;
  members: User[];
}

export interface LoginResult {
  user: User;
  token: JWToken;
}

export interface PlayerAssignment {
  playerID: PlayerID;
  playerNumber: number;
}

export interface Game<GS extends GameState> {
  id: GameID;
  version: number;
  assignments: PlayerAssignment[];
  gameState: GS;
}

export interface GamePatch {
  gameID: GameID;
  version: number;
  patch: JSON;
}

export interface GamePatchSubscriptionData {
  gamePatch: GamePatch;
}

export interface Player {
  id: PlayerID;
  token: JWToken;
}

export interface GameSchedule<GS extends GameState> {
  id: GameScheduleID;
  game: Game<GS>;
  players: Player[];
}
