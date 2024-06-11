import { BackendGameDefinition } from "playfulbot-game-backend"
import { PlayerAssignment } from "~game-runner/core/entities/Game"

/**
 * Game configuration returned by the GameProvider
 */
export interface GameConfig {
  id: string,
  players: PlayerAssignment[],
  gameDefinition: BackendGameDefinition,
};

/**
 * Provide games which can be added to the GameRepository
 */
export interface GameProvider {
  fetchGame(): Promise<GameConfig>
};