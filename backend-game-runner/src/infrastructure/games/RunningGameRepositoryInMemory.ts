import { Game } from "~game-runner/core/entities/Game";
import { RunningGameRepository } from "../../core/entities/RunningGameRepository";
import { GameID } from "~game-runner/core/entities/base-types";

export class RunningGameRepositoryInMemory implements RunningGameRepository {
  readonly games = new Map<string, Game>();

  get nbGames(): number {
    return this.games.size;
  }

  get(id: GameID): Game | undefined {
    return this.games.get(id);
  }

  list(): Game[] {
    return [...this.games.values()];
  }

  add(game: Game): void {
    this.games.set(game.id, game);
  }

  delete(id: GameID): void {
    this.games.delete(id);
  }

  clear(): void {
    this.games.clear();
  }
}