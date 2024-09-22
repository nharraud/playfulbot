import { beforeEach, describe, expect, test } from 'vitest';
import { GameScheduler } from '~game-runner/core/use-cases/game-scheduling/GameScheduler';
import { RunningGameRepositoryInMemory } from '~game-runner/infrastructure/games/RunningGameRepositoryInMemory';
import { afterEach } from 'node:test';
import { DeferredPromise } from 'playfulbot-backend-commons/lib/utils';
;
function basicInit() {
    return {
        end: false,
        players: [{ playing: true }],
        number: 0,
    };
}
const noopHandler = (state, actions) => { };
const basicGameDefinition = { name: 'TestGame', actionHandler: noopHandler, init: basicInit };
describe('core/entities/game', () => {
    const players = [{ playerID: 'a' }];
    let gameScheduler;
    let gameRepository;
    let gameProvider;
    class BasicGameProvider {
        counter = 0;
        fetchGame() {
            return Promise.resolve({ id: `testGame${++this.counter}`, gameDefinition: basicGameDefinition, players });
        }
    }
    class TestGameRepository extends RunningGameRepositoryInMemory {
        #gameCount = 0;
        #waitGameCount = Infinity;
        #waitGamePromise;
        waitForGameCount(nbGames) {
            this.#waitGameCount = nbGames;
            this.#waitGamePromise = new DeferredPromise();
            if (this.#gameCount === this.#waitGameCount) {
                this.#waitGamePromise.resolve();
            }
            return this.#waitGamePromise.promise;
        }
        add(game) {
            super.add(game);
            this.#gameCount += 1;
            if (this.#gameCount === this.#waitGameCount) {
                this.#waitGamePromise.resolve();
            }
        }
        delete(id) {
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
    });
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
        const stopRromise = gameScheduler.stop();
        for (const game of gameRepository.list()) {
            game.cancel();
        }
        await stopRromise;
        expect(gameScheduler.isRunning).toBe(false);
    });
    test('should return to status "stopped" when all games are finished', async () => {
        gameScheduler.start();
        await gameRepository.waitForGameCount(2);
        const stopRromise = gameScheduler.stop();
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
//# sourceMappingURL=GameScheduler.test.js.map