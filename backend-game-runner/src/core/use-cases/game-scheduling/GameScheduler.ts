import { RunningGameRepository } from "~game-runner/core/entities/RunningGameRepository";
import { GameCancelled, GameProvider, StopListeningHandler as StopListeningGameNotificationHandler } from "./GameProvider";
import { Game } from "~game-runner/core/entities/Game";
import { PubSubGameWatcher } from "~game-runner/infrastructure/PubSubGameWatcher";

/**
 * Schedule games returned by a GameProvider. The GameSchedulre is in charge of adding games
 * when ressources allow it.
 */
export class GameScheduler {
  readonly gameProvider: GameProvider;
  readonly gameRepository: RunningGameRepository;
  #status: 'running' | 'stopping' | 'stopped';
  #stopListeningGameNotifications: StopListeningGameNotificationHandler;

  constructor(gameProvider: GameProvider, gameRepository: RunningGameRepository) {
    this.gameProvider = gameProvider;
    this.gameRepository = gameRepository;
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
    this.#stopListeningGameNotifications?.();
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
    this.#stopListeningGameNotifications = this.gameProvider.onNotification(async (notification) => {
      if (notification instanceof GameCancelled) {
        const game = this.gameRepository.get(notification.gameId);
        game?.cancel();
      }
    });
    while (this.#status === 'running') {
      await this.gameRepository.canAddGame();
      const gameConfig = await this.gameProvider.fetchGame();
      if (gameConfig.id) {
        const game = new Game(gameConfig.id, gameConfig.gameDefinition, gameConfig.players);
        this.gameRepository.add(game);
        game.watch(new PubSubGameWatcher());
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

export class InvalidGameSchedulerState extends Error {}
