import { Player } from '~playfulbot/core/entities/Players';
import { GameRef } from './GameRef';

export interface DebugArena {
  createNewGame(players?: Player[]): Promise<GameRef>;
}
