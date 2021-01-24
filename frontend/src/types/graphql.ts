import { GameState } from 'src/types/gameState';

export interface User {
  id: string;
  username: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export interface Player {
  playerNumber: number;
  user: User;
  token: string;
}

export interface Game<GS extends GameState> {
  id: string;
  version: number;
  players: Player[];
  gameState: GS;
}