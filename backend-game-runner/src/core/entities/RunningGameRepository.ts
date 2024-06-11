import { Game } from "~game-runner/core/entities/Game";
import { GameID } from "~game-runner/core/entities/base-types";

export interface RunningGameRepository {
  nbGames: number;
  list(): Game[];
  get(id: GameID): Game | undefined;
  add(game: Game): void;
  delete(id: GameID): void;
};
