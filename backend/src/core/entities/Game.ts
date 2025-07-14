import { GameDefinitionID } from "playfulbot-config-loader";
import { GameID } from "playfulbot-game";
import { ArenaID, GameRunnerId } from "~playfulbot/core/entities/base-types";
import { PlayerAssignment } from "~playfulbot/core/entities/PlayerAssignment";

export type GameStatus = 'pending' | 'started' | 'ended';

export interface Game {
  gameId: GameID,
  gameDefId: GameDefinitionID,
  startedAt: string,
  players: PlayerAssignment[],
  arenaId?: ArenaID,
  runnerId?: GameRunnerId,
  status: GameStatus,
  cancelled: boolean
};
