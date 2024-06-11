import { randomUUID as uuidv4 } from 'crypto';
import * as jsonpatch from 'fast-json-patch';
import { DeferredPromise, cloneDeep } from 'playfulbot-backend-commons/lib/utils/index.js';
import { ForbiddenError, InvalidArgument, InvalidGameState, PlayingOutOfTurn, AlreadyPlayed } from './errors';
export class Game {
    id;
    canceled = false;
    version;
    gameDefinition;
    gameState;
    initialState;
    patches = new Array();
    players;
    storedActions = new Map();
    #gameEndPromise = new DeferredPromise();
    watcher;
    stateObserver;
    constructor(gameDefinition, players) {
        this.id = uuidv4();
        this.version = 0;
        this.gameDefinition = gameDefinition;
        this.gameState = gameDefinition.init();
        this.initialState = cloneDeep(this.gameState);
        this.stateObserver = jsonpatch.observe(this.gameState);
        this.players = players;
        // Game.games.set(this.id, this);
        if (this.gameState.players.length !== players.length) {
            throw new InvalidGameState('game state players number and assigned players number do not match');
        }
    }
    watch(watcher) {
        this.watcher = watcher;
    }
    cancel() {
        this.canceled = true;
        // FIXME: there could be a race condition here if the game is played at the same time.
        this.version += 1;
        this.watcher?.notifyGameCancelled(this.id, this.version);
        jsonpatch.unobserve(this.gameState, this.stateObserver);
    }
    isActive() {
        return !(this.canceled || this.gameState.end);
    }
    play(playerIDOrNumber, actionData) {
        let playerNumber;
        if (typeof playerIDOrNumber === 'number') {
            playerNumber = playerIDOrNumber;
            if (playerNumber < 0 || playerNumber >= this.players.length) {
                throw new InvalidArgument(`Game does not have such player.`);
            }
        }
        else {
            playerNumber = this.players.findIndex((assignment) => assignment.playerID === playerIDOrNumber);
            if (playerNumber === -1) {
                throw new ForbiddenError(`Game does not have such player.`);
            }
        }
        const playerState = this.gameState.players[playerNumber];
        if (!playerState.playing) {
            throw new PlayingOutOfTurn();
        }
        const action = {
            player: playerNumber,
            data: actionData,
        };
        const expectedActions = this.gameState.players.filter((player) => player.playing).length;
        let actionsToPlay = null;
        if (expectedActions > 1) {
            const nbStoredActions = this.storeAction(action);
            if (nbStoredActions < expectedActions) {
                return;
            }
            actionsToPlay = Array.from(this.storedActions.values());
            this.storedActions.clear();
        }
        else {
            actionsToPlay = [action];
        }
        this.gameDefinition.actionHandler(this.gameState, actionsToPlay);
        const patch = jsonpatch.generate(this.stateObserver);
        this.patches.push(patch);
        if (patch.length === 0) {
            return;
        }
        this.version += 1;
        this.watcher?.notifyGameStateChanged(this.id, this.version, patch, this.winners);
        if (this.gameState.end) {
            this.gameEndPromise.resolve(this);
            jsonpatch.unobserve(this.gameState, this.stateObserver);
        }
    }
    storeAction(action) {
        if (this.storedActions.has(action.player)) {
            throw new AlreadyPlayed();
        }
        this.storedActions.set(action.player, action);
        return this.storedActions.size;
    }
    getStoredActions(id) {
        return Array.from(this.storedActions.values());
    }
    get winners() {
        if (!this.gameState.end) {
            return undefined;
        }
        return this.gameState.players
            .map((player, playerNumber) => ({
            playerNumber,
            winner: player.winner,
        }))
            .filter((player) => player.winner)
            .map((player) => player.playerNumber);
    }
}
//# sourceMappingURL=Game.js.map