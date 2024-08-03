import { GameID } from 'playfulbot-game';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';
import { DebugArenaID, GameRunnerId } from '../entities/base-types';
import { GameRef, GameRefWithDate } from './GameRef';

export interface GameRepository {
  addGame({ gameDefId, players }: { gameDefId: string, players: PlayerAssignment[], arena?: DebugArenaID, waitUntilStarted?: Boolean }): Promise<GameRef>;
  getArenaLatestGame(arenaId: DebugArenaID): Promise<GameRefWithDate | undefined>;
  // stopGame({ gameId }: { gameId: GameID }): Promise<void>;
  // listenToPlayerGame({ playerID }: { playerID: PlayerID }): AsyncIterator<GameID>;
}