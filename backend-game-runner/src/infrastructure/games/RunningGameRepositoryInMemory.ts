import { Game } from "~game-runner/core/entities/Game";
import { RunningGameRepository } from "../../core/entities/RunningGameRepository";
import { GameID } from "~game-runner/core/entities/base-types";
import { DeferredPromise } from "playfulbot-backend-commons/lib/utils";

export interface RepositoryConfiguration {
  /** Maximum number of games stored */
  maxGames: number;
}
export class RunningGameRepositoryInMemory implements RunningGameRepository {
  private readonly games = new Map<string, Game>();
  private readonly config;
  private canAddGamePromise: DeferredPromise<void>;

  constructor(config: RepositoryConfiguration) {
    this.config = config;
  }

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
    // TODO: handle round games as well.
    game.gameCancelledPromise.then(() => {
      this.games.delete(game.id);
    });
  }

  delete(id: GameID): void {
    this.games.delete(id);
    if (this.canAddGamePromise) {
      this.canAddGamePromise.resolve();
      this.canAddGamePromise = undefined;
    }
  }

  clear(): void {
    this.games.clear();
  }

  canAddGame(): Promise<void> {
    if (this.games.size < this.config.maxGames) {
      return Promise.resolve();
    }
    this.canAddGamePromise = new DeferredPromise<void>();
    return this.canAddGamePromise.promise;
  }
}