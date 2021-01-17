import { GameState } from "~playfulbot/gameState/types";

export interface User {
  id: string,
  username: string
}

export interface Player {
  playerNumber: number
  user: User
  token: string,
}

export interface Game<GS extends GameState> {
  id: string
  version: number
  players: Player[]
  gameState: GS
}

export interface DebugGame {
  id: string
  game: Game<GameState>
}

enum NoDebugGameReason {
  SERVER_ERROR,
}

export class NoDebugGame {
  reason: NoDebugGameReason
}

export type DebugGameResult = DebugGame | NoDebugGame;
