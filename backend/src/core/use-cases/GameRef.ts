import { GameID } from "playfulbot-game";
import { GameRunnerId } from "../entities/base-types";

export interface GameRef {
  gameId: GameID,
  runnerId?: GameRunnerId,
}

export interface GameRefWithDate extends GameRef {
  gameId: GameID,
  runnerId?: GameRunnerId,
  startedAt: string,
};