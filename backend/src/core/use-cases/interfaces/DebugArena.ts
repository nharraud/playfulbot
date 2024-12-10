import { Player } from '../model/Player';
import { GameRef } from './GameRef';

export interface DebugArena {
  createNewGame(players?: Player[]): Promise<GameRef>;
}
