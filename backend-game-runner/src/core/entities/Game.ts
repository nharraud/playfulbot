import { randomUUID as uuidv4 } from 'crypto';
import * as jsonpatch from 'fast-json-patch';
import { GameState } from 'playfulbot-game';
import { BackendGameDefinition, GameAction } from 'playfulbot-game-backend';
import { DeferredPromise, cloneDeep } from 'playfulbot-backend-commons/lib/utils/index.js';
import { ForbiddenError, InvalidArgument, InvalidGameState, PlayingOutOfTurn, AlreadyPlayed, GameCancelledError } from './errors';
import { GameID, PlayerID, JSONPatch } from './base-types';
import { GameWatcher } from './GameWatcher';

export interface PlayerAssignment {
  playerID: PlayerID;
}

export class Game {
  readonly id: GameID;

  #cancelled = false;

  version: number;

  readonly gameDefinition: BackendGameDefinition;

  gameState: GameState;

  readonly initialState: GameState;
  readonly patches = new Array<unknown>();

  readonly players: PlayerAssignment[];

  storedActions = new Map<number, GameAction>();

  #gameEndPromise = new DeferredPromise<this>();

  watcher?: GameWatcher;
  stateObserver: jsonpatch.Observer<GameState>;

  constructor(id: string, gameDefinition: BackendGameDefinition, players: PlayerAssignment[]) {
    this.id = id;
    this.version = 0;
    this.gameDefinition = gameDefinition;
    this.gameState = gameDefinition.init();
    this.initialState = cloneDeep(this.gameState);
    this.stateObserver = jsonpatch.observe<GameState>(this.gameState);
    this.players = players;
    // Game.games.set(this.id, this);
    if (this.gameState.players.length !== players.length) {
      throw new InvalidGameState('game state players number and assigned players number do not match');
    }
  }

  watch(watcher: GameWatcher) {
    this.watcher = watcher;
  }

  cancel(): void {
    this.#cancelled = true;
    // FIXME: there could be a race condition here if the game is played at the same time.
    this.version += 1;
    this.watcher?.notifyGameCancelled(this.id, this.version);
    jsonpatch.unobserve(this.gameState, this.stateObserver);
    this.#gameEndPromise.resolve(this);
  }

  get isActive(): boolean {
    return !(this.#cancelled || this.gameState.end);
  }

  get cancelled(): boolean {
    return this.#cancelled;
  }

  get gameEndPromise(): Promise<Game> {
    return this.#gameEndPromise.promise;
  }

  play(playerNumber: number, actionData: Record<string, any>): void;
  play(playerID: PlayerID, actionData: Record<string, any>): void;
  play(playerIDOrNumber: number | PlayerID, actionData: Record<string, any>): void {
    let playerNumber: number;
    if (typeof playerIDOrNumber === 'number') {
      playerNumber = playerIDOrNumber;
      if (playerNumber < 0 || playerNumber >= this.players.length) {
        throw new InvalidArgument(`Game does not have such player.`);
      }
    } else {
      playerNumber = this.players.findIndex(
        (assignment) => assignment.playerID === playerIDOrNumber
      );
      if (playerNumber === -1) {
        throw new ForbiddenError(`Game does not have such player.`);
      }
    }
    const playerState = this.gameState.players[playerNumber];

    if (!playerState.playing) {
      throw new PlayingOutOfTurn();
    }

    if (!this.isActive) {
      throw new GameCancelledError();
    }
  
    const action = {
      player: playerNumber,
      data: actionData,
    };

    const expectedActions = this.gameState.players.filter((player) => player.playing).length;
    let actionsToPlay: Array<GameAction> = null;
    if (expectedActions > 1) {
      const nbStoredActions = this.storeAction(action);
      if (nbStoredActions < expectedActions) {
        return;
      }
      actionsToPlay = Array.from(this.storedActions.values());
      this.storedActions.clear();
    } else {
      actionsToPlay = [action];
    }

    this.gameDefinition.actionHandler(this.gameState, actionsToPlay);

    const patch: JSONPatch = jsonpatch.generate(this.stateObserver);
    this.patches.push(patch);

    if (patch.length === 0) {
      return;
    }
    this.version += 1;

    this.watcher?.notifyGameStateChanged(this.id, this.version, patch, this.winners);
    if (this.gameState.end) {
      this.#gameEndPromise.resolve(this);
      jsonpatch.unobserve(this.gameState, this.stateObserver);
    }
  }

  storeAction(action: GameAction): number {
    if (this.storedActions.has(action.player)) {
      throw new AlreadyPlayed();
    }
    this.storedActions.set(action.player, action);
    return this.storedActions.size;
  }

  getStoredActions(id: GameID): GameAction[] {
    return Array.from(this.storedActions.values());
  }

  get winners(): number[] | undefined {
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
