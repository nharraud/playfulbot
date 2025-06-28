import { GameID } from 'playfulbot-game';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';
import { ArenaID, GameRunnerId } from '~playfulbot/core/entities/base-types';
import { GameRef, GameRefWithDate } from './GameRef';

export interface GameRepository {
  addGame({ gameDefId, players }: { gameDefId: string, players: PlayerAssignment[], arenaId?: ArenaID, waitUntilStarted?: Boolean }): Promise<GameRef>;
  getArenaLatestGame(arenaId: ArenaID): Promise<GameRefWithDate | undefined>;
  close(): Promise<void>;
  // stopGame({ gameId }: { gameId: GameID }): Promise<void>;
  // listenToPlayerGame({ playerID }: { playerID: PlayerID }): AsyncIterator<GameID>;
}