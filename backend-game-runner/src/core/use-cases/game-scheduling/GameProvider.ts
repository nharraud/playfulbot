import { BackendGameDefinition } from "playfulbot-game-backend"
import { GameID } from "~game-runner/core/entities/base-types";
import { PlayerAssignment } from "~game-runner/core/entities/Game"

export class GameNotification {
  constructor(readonly gameId: GameID) {}
}

export class GameCancelled extends GameNotification {}

export type GameNotificationListener = (notification: GameNotification) => Promise<void>;

export type StopListeningHandler = () => void;

/**
 * Game configuration returned by the GameProvider
 */
export interface GameConfig {
  id: GameID,
  players: PlayerAssignment[],
  gameDefinition: BackendGameDefinition
};

/**
 * Provide games which can be added to the GameRepository
 */
export interface GameProvider {
  fetchGame(): Promise<GameConfig>,
  onNotification(listener: GameNotificationListener): StopListeningHandler,
  close(): Promise<void>;
};