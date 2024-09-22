import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Game } from '~game-runner/core/entities/Game';
import { cloneDeep } from 'tests/utils/cloneDeep';
import { AlreadyPlayed, InvalidGameState, PlayingOutOfTurn } from '~game-runner/core/entities/errors';
;
function basicInit() {
    return {
        end: false,
        players: [{ playing: true }],
        number: 0,
    };
}
function multiInit() {
    return {
        end: false,
        players: [{ playing: true }, { playing: false }, { playing: true }],
        number: 0,
    };
}
const noopHandler = (state, actions) => { };
const basicGameDefinition = { name: 'TestGame', actionHandler: noopHandler, init: basicInit };
describe('core/entities/game', () => {
    const players = [{ playerID: 'a' }];
    const multiPlayers = [{ playerID: 'a' }, { playerID: 'b' }, { playerID: 'c' }];
    describe('errors', () => {
        test('should throw an error if game state player number is higher than assigned players number', async () => {
            expect(() => new Game('testgame', basicGameDefinition, [])).toThrow(InvalidGameState);
        });
        test('should throw an error if game state player number is lower than assigned players number', async () => {
            expect(() => new Game('testgame', basicGameDefinition, [{ playerID: 'a' }, { playerID: 'b' }])).toThrow(InvalidGameState);
        });
        test('should throw an error if a player plays out of turn', async () => {
            const basicGameDefinition = { name: 'TestGame', actionHandler: noopHandler, init: multiInit };
            const game = new Game('testgame', basicGameDefinition, multiPlayers);
            expect(() => game.play(1, {})).toThrow(PlayingOutOfTurn);
        });
        test('should throw an error if a player plays multiple times', async () => {
            const basicGameDefinition = { name: 'TestGame', actionHandler: noopHandler, init: multiInit };
            const game = new Game('testgame', basicGameDefinition, multiPlayers);
            game.play(0, {});
            expect(() => game.play(0, {})).toThrow(AlreadyPlayed);
        });
    });
    test('should initialize the game at creation', async () => {
        const game = new Game('testgame', basicGameDefinition, players);
        expect(game.initialState).toEqual(basicInit());
        expect(game.initialState).toEqual(game.gameState);
        expect(game.isActive).toBe(true);
    });
    test('should cancel game', async () => {
        const game = new Game('testgame', basicGameDefinition, players);
        game.cancel();
        expect(game.isActive).toBe(false);
    });
    test('should change state when playing game', async () => {
        let receivedState;
        let receivedActions;
        let handler = (state, actions) => {
            receivedState = cloneDeep(state);
            receivedActions = cloneDeep(actions);
            state.number = 2;
        };
        const basicGameDefinition = { name: 'TestGame', actionHandler: handler, init: basicInit };
        const game = new Game('testgame', basicGameDefinition, players);
        const action = { number: 1 };
        game.play(0, action);
        const expectedState = basicInit();
        expectedState.number = 2;
        expect(game.gameState).toEqual(expectedState);
        expect(receivedState).toEqual(basicInit());
        expect(receivedActions).toEqual([{ player: 0, data: action }]);
        expect(game.isActive).toBe(true);
    });
    test('should generate patches and increment version when playing game', async () => {
        let handler = (state, actions) => {
            state.number = actions[0].data.number;
        };
        const basicGameDefinition = { name: 'TestGame', actionHandler: handler, init: basicInit };
        const game = new Game('testgame', basicGameDefinition, players);
        expect(game.patches).toEqual([]);
        expect(game.version).toEqual(0);
        game.play(0, { number: 2 });
        expect(game.version).toEqual(1);
        expect(game.patches[0]).toEqual([{ op: 'replace', path: '/number', value: 2 }]);
        game.play(0, { number: 6 });
        expect(game.version).toEqual(2);
        expect(game.patches[1]).toEqual([{ op: 'replace', path: '/number', value: 6 }]);
    });
    test('should wait for all players whose turn it is to play before calling handler', async () => {
        let receivedState;
        let receivedActions;
        let handler = vi.fn((state, actions) => {
            receivedState = cloneDeep(state);
            receivedActions = cloneDeep(actions);
            console.error(actions[0]);
            state.number = actions.reduce((acc, val) => acc + val.data.number, 0);
        });
        const basicGameDefinition = { name: 'TestGame', actionHandler: handler, init: multiInit };
        const game = new Game('testgame', basicGameDefinition, [{ playerID: 'a' }, { playerID: 'b' }, { playerID: 'c' }]);
        const action0 = { number: 1 };
        const action2 = { number: 2 };
        game.play(0, action0);
        expect(handler).not.toHaveBeenCalled();
        game.play(2, action2);
        expect(handler).toHaveBeenCalled();
        expect(game.gameState.number).toEqual(3);
        expect(receivedState).toEqual(multiInit());
        expect(receivedActions).toEqual([{ player: 0, data: action0 }, { player: 2, data: action2 }]);
        expect(game.isActive).toBe(true);
    });
    test('should end game', async () => {
        let handler = (state) => {
            state.end = true;
        };
        const basicGameDefinition = { name: 'TestGame', actionHandler: handler, init: basicInit };
        const game = new Game('testgame', basicGameDefinition, players);
        game.play(0, {});
        expect(game.isActive).toEqual(false);
        await expect(game.gameEndPromise).resolves.toBeInstanceOf(Game);
    });
    test('should return winners', async () => {
        function init() {
            return {
                end: false,
                players: [{ playing: true }, { playing: true }, { playing: true }],
                number: 0,
            };
        }
        let handler = (state, actions) => {
            for (const action of actions) {
                state.players[action.player].winner = action.data.wins;
            }
            state.end = true;
        };
        const basicGameDefinition = { name: 'TestGame', actionHandler: handler, init };
        const game = new Game('testgame', basicGameDefinition, multiPlayers);
        game.play(0, { wins: true });
        game.play(1, { wins: false });
        game.play(2, { wins: true });
        await game.gameEndPromise;
        expect(game.winners).toEqual(expect.arrayContaining([0, 2]));
        expect(game.winners).to.have.lengthOf(2);
    });
    describe('watchers', () => {
        let watcher;
        beforeEach(() => {
            watcher = {
                notifyGameCancelled: vi.fn(),
                notifyGameStateChanged: vi.fn(),
            };
        });
        test('should nofify watchers when game is cancelled', () => {
            const game = new Game('testgame', basicGameDefinition, players);
            game.watch(watcher);
            game.cancel();
            expect(watcher.notifyGameCancelled).toHaveBeenCalledWith(game.id, 1);
        });
        test('should nofify watchers when game state is changed', () => {
            let handler = (state) => {
                state.number = 42;
                state.end = true;
                state.players[0].winner = true;
            };
            const basicGameDefinition = { name: 'TestGame', actionHandler: handler, init: basicInit };
            const game = new Game('testgame', basicGameDefinition, players);
            game.watch(watcher);
            game.play(0, {});
            expect(watcher.notifyGameStateChanged).toHaveBeenCalledWith(game.id, 1, game.patches[0], [0]);
        });
    });
});
//# sourceMappingURL=game.test.js.map