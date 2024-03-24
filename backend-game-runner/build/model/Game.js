import { randomUUID as uuidv4 } from 'crypto';
import * as jsonpatch from 'fast-json-patch';
import { DeferredPromise, cloneDeep } from 'playfulbot-backend-commons/lib/utils/index.js';
import { pubsub } from 'playfulbot-backend-commons/lib/pubsub/index.js';
import { ForbiddenError, InvalidArgument, PlayingOutOfTurn, PlayingTwice, } from '../errors.js';
export class Game {
    static games = new Map();
    id;
    canceled = false;
    version;
    gameDefinition;
    gameState;
    initialState;
    patches = new Array();
    players;
    storedActions = new Map();
    gameEndPromise = new DeferredPromise();
    constructor(gameDefinition, players) {
        this.id = uuidv4();
        this.version = 0;
        this.gameDefinition = gameDefinition;
        this.gameState = gameDefinition.init();
        this.initialState = cloneDeep(this.gameState);
        this.players = players;
        Game.games.set(this.id, this);
    }
    static getGame(id) {
        return Game.games.get(id);
    }
    delete() {
        Game.games.delete(this.id);
    }
    cancel() {
        this.canceled = true;
        // FIXME: there could be a race condition here if the game is played at the same time.
        this.version += 1;
        pubsub.publish('GAME_CHANGED', this.id, {
            canceled: true,
            version: this.version,
        });
        pubsub.complete('GAME_CHANGED', this.id);
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
        const observer = jsonpatch.observe(this.gameState);
        if (!playerState.playing) {
            throw new PlayingOutOfTurn();
        }
        this.gameDefinition.actionHandler(this.gameState, actionsToPlay);
        const patch = jsonpatch.generate(observer);
        jsonpatch.unobserve(this.gameState, observer);
        this.patches.push(patch);
        if (patch.length === 0) {
            return;
        }
        this.version += 1;
        pubsub.publish('GAME_CHANGED', this.id, {
            version: this.version,
            patch,
            winners: this.winners,
        });
        if (this.gameState.end) {
            pubsub.complete('GAME_CHANGED', this.id);
            this.gameEndPromise.resolve(this);
        }
    }
    storeAction(action) {
        if (this.storedActions.has(action.player)) {
            throw new PlayingTwice();
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