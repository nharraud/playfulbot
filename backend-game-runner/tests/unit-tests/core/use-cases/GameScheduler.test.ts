import { beforeEach, describe, expect, test } from 'vitest';
import { GameAction, GameActionHandler } from 'playfulbot-game-backend';
import { GameState } from 'playfulbot-game';
import { Game, PlayerAssignment } from '~game-runner/core/entities/Game';
import { GameScheduler } from '~game-runner/core/use-cases/game-scheduling/GameScheduler';
import { GameConfig, GameProvider } from '~game-runner/core/use-cases/game-scheduling/GameProvider';
import { RunningGameRepositoryInMemory } from '~game-runner/infrastructure/games/RunningGameRepositoryInMemory';
import { afterEach } from 'node:test';
import { DeferredPromise } from 'playfulbot-backend-commons/lib/utils';
import { GameID } from '~game-runner/core/entities/base-types';

interface TestGameState extends GameState {
  number: number
};

interface TestActionData extends Record<string, unknown> {
  wins?: boolean;
  number?: number;
}

interface TestGameAction extends GameAction {
  player: number;
  data: TestActionData;
}

function basicInit(): TestGameState {
  return {
    end: false,
    players: [{ playing: true }],
    number: 0,
  };
}

const noopHandler: GameActionHandler<TestGameState, TestGameAction> = (
  state: TestGameState,
  actions: TestGameAction[]
) => { };

const basicGameDefinition = { name: 'TestGame', actionHandler: noopHandler, init: basicInit };

describe('core/entities/game', () => {
  const players: PlayerAssignment[] = [{ playerID: 'a' }];
  let gameScheduler: GameScheduler;
  let gameRepository : TestGameRepository;
  let gameProvider: BasicGameProvider;

  class BasicGameProvider implements GameProvider {
    counter = 0;
    fetchGame(): Promise<GameConfig> {
        return Promise.resolve({ id: `testGame${++this.counter}`, gameDefinition: basicGameDefinition, players });
    }
  }

  class TestGameRepository extends RunningGameRepositoryInMemory {
    #gameCount = 0;
    #waitGameCount = Infinity;
    #waitGamePromise?: DeferredPromise<void>;

    waitForGameCount(nbGames: number) {
      this.#waitGameCount = nbGames;
      this.#waitGamePromise = new DeferredPromise();
      if (this.#gameCount === this.#waitGameCount) {
        this.#waitGamePromise.resolve();
      }
      return this.#waitGamePromise.promise;
    }

    add(game: Game): void {
        super.add(game);
        this.#gameCount += 1;
        if (this.#gameCount === this.#waitGameCount) {
          this.#waitGamePromise.resolve();
        }
    }

    delete(id: GameID): void {
      super.delete(id);
      this.#gameCount -= 1;
      if (this.#gameCount === this.#waitGameCount) {
        this.#waitGamePromise.resolve();
      }
    }
  }

  beforeEach(() => {
    gameRepository = new TestGameRepository();
    gameProvider = new BasicGameProvider();
    gameScheduler = new GameScheduler(gameProvider, gameRepository, { maxGames: 2 });
  });

  afterEach(async () => {
    await gameScheduler.stop(true);
  })

  test('should not be running status when not started or stopping', async () => {
    expect(gameScheduler.isRunning).toBe(false);
  });

  test('should be running games when started', async () => {
    gameScheduler.start();
    expect(gameScheduler.isRunning).toBe(true);
    await gameRepository.waitForGameCount(2);
    for (const game of gameRepository.list()) {
      expect(game.isActive).toBe(true);
    }
  });

  test('should be running when games are not stopped yet', async () => {
    gameScheduler.start();
    await gameRepository.waitForGameCount(2);
    gameScheduler.stop();
    expect(gameScheduler.isRunning).toBe(true);
  });

  test('should cancel games when GameScheduler.stop(true) is called', async () => {
    gameScheduler.start();
    await gameRepository.waitForGameCount(2);
    await gameScheduler.stop(true);
    expect(gameScheduler.isRunning).toBe(false);
    for (const game of gameRepository.list()) {
      expect(game.cancelled).toBe(true);
    }
  });

  test('should return to status "stopped" when all games are finished', async () => {
    gameScheduler.start();
    await gameRepository.waitForGameCount(2);
    const stopRromise =  gameScheduler.stop();
    for (const game of gameRepository.list()) {
      game.cancel();
    }
    await stopRromise;
    expect(gameScheduler.isRunning).toBe(false);
  });

  test('should return to status "stopped" when all games are finished', async () => {
    gameScheduler.start();
    await gameRepository.waitForGameCount(2);
    const stopRromise =  gameScheduler.stop();
    for (const game of gameRepository.list()) {
      game.cancel();
    }
    await stopRromise;
    expect(gameScheduler.isRunning).toBe(false);
  });

  test('should replace finished games', async () => {
    gameScheduler.start();
    await gameRepository.waitForGameCount(2);
    const gamesBeforeCancel = gameRepository.list();
    const cancelledGame = gamesBeforeCancel[0];
    cancelledGame.cancel();
    await gameRepository.waitForGameCount(1);
    expect(gameRepository.get(cancelledGame.id)).toBeUndefined();
    await gameRepository.waitForGameCount(2);
  });
});
