import { GameID, JSONPatch } from './base-types';

export interface GameWatcher {
  notifyGameCancelled(gameId: GameID, version: number): void;
  notifyGameStateChanged(gameId: GameID, version: number, patch: JSONPatch, winners?: number[]): void;
}