import { RunningGameRepository } from "~game-runner/core/entities/RunningGameRepository";
import { GameProvider } from "./GameProvider";
import { Game } from "~game-runner/core/entities/Game";


export interface GameSchedulerConfig {
  /** maximum number of games the GameScheduler will schedule */
  maxGames: number
};

/**
 * Schedule games returned by a GameProvider. The GameSchedulre is in charge of adding games
 * when ressources allow it.
 */
export class GameScheduler {
  readonly config: GameSchedulerConfig;
  readonly gameProvider: GameProvider;
  readonly gameRepository: RunningGameRepository;
  #status: 'running' | 'stopping' | 'stopped';

  constructor(gameProvider: GameProvider, gameRepository: RunningGameRepository, config: GameSchedulerConfig) {
    this.gameProvider = gameProvider;
    this.gameRepository = gameRepository;
    this.config = config;
    this.#status = 'stopped';
  }

  get isRunning(): Boolean {
    return this.#status === 'running' || this.#status === 'stopping';
  }

  /**
   * Stop scheduling additional games
   * @param cancel if true, cancel games
   * @returns a promise resolving when all games are stopped
   */
  async stop(cancel: Boolean = false): Promise<void> {
    this.#status = 'stopping';
    const games =  this.gameRepository.list();
    if (cancel) {
      for (const game of games) {
        game.cancel();
      }
    }
    await Promise.all(games.map(game => game.gameEndPromise));
    this.#status = 'stopped';
  }

  /**
   * Stop scheduling additional games
   * @returns a promise resolving when all games are stopped
   */
  async start() {
    if (this.#status === 'stopping') {
      throw new InvalidGameSchedulerState('Cannot schedule games when the scheduler is stopping');
    }
    this.#status = 'running';
    while (this.#status === 'running') {
      if (this.gameRepository.nbGames < this.config.maxGames) {
        const gameConfig = await this.gameProvider.fetchGame();
        const game = new Game(gameConfig.id, gameConfig.gameDefinition, gameConfig.players);
        this.gameRepository.add(game);
      } else {
        await Promise.any(this.gameRepository.list().map(game => game.gameEndPromise));
        const games = this.gameRepository.list();
        for (const game of games) {
          if (!game.isActive) {
            this.gameRepository.delete(game.id);
          }
        }
      }
    }
  }
}

export class InvalidGameSchedulerState extends Error {}
