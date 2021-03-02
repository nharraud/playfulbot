import { GameState } from '~playfulbot/types/gameState';
import { JWToken } from './token';

export type UserID = string;
export type PlayerID = string;
export type TeamID = string;
export type GameID = string;
export type GameScheduleID = string;

export interface User {
  id: UserID;
  username: string;
  password: string;
}

export interface Team {
  id: TeamID;
  name: string;
  members: User[];
}

export interface PlayerAssignment {
  playerID: PlayerID;
  userID?: UserID;
  playerNumber: number;
}

export interface Game<GS extends GameState> {
  id: GameID;
  version: number;
  assignments: PlayerAssignment[];
  gameState: GS;
  gameSchedules: GameScheduleID[];
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
  game?: Game<GS>;
  players: Player[];
}
