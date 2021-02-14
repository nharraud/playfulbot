import { GameID, PlayerID, UserID } from '~playfulbot/types/backend';
import { GameState } from './gameState';
import { JWToken } from './token';

export interface UserResult {
  id: UserID;
  username: string;
}

export interface LoginResult {
  user: UserResult;
  token: JWToken;
}

export interface PlayerAssignmentResult {
  playerID: PlayerID;
  playerNumber: number;
}

export interface GameResult<GS extends GameState> {
  id: GameID;
  version: number;
  assignments: PlayerAssignmentResult[];
  gameState: GS;
}
