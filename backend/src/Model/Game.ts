import { v4 as uuidv4 } from 'uuid';
import * as jsonpatch from 'fast-json-patch';
import { GameState } from '~playfulbot/types/gameState';
import { GameDefinition } from '~playfulbot/model/GameDefinition';
import { pubsub } from '~playfulbot/pubsub';
import { GameAction } from '~playfulbot/types/action';
import { ForbiddenError, PlayingOutOfTurn, PlayingTwice } from '~playfulbot/errors';
import { PlayerID } from './Player';

export type GameID = string;

export interface PlayerAssignment {
  playerID: PlayerID;
}

export class Game {
  static readonly games = new Map<string, Game>();

  readonly id: GameID;

  canceled = false;

  version: number;

  gameDefinition: GameDefinition;

  gameState: GameState;

  players: PlayerAssignment[];

  storedActions = new Map<number, GameAction>();

  constructor(gameDefinition: GameDefinition, players: PlayerAssignment[]) {
    this.id = uuidv4();
    this.version = 0;
    this.gameDefinition = gameDefinition;
    this.gameState = gameDefinition.init();
    this.players = players;
    Game.games.set(this.id, this);
  }

  static getGame(id: GameID): Game {
    return Game.games.get(id);
  }

  delete(): void {
    Game.games.delete(this.id);
  }

  cancel(): void {
    this.canceled = true;
    // FIXME: there could be a race condition here if the game is played at the same time.
    this.version += 1;
    pubsub.publish('GAME_CHANGED', this.id, {
      canceled: true,
      version: this.version,
    });
    pubsub.complete('GAME_CHANGED', this.id);
  }

  isActive(): boolean {
    return !(this.canceled || this.gameState.end);
  }

  play(playerID: PlayerID, actionName: string, actionData: Record<string, any>): void {
    const playerNumber = this.players.findIndex((assignment) => assignment.playerID === playerID);
    if (playerNumber === -1) {
      throw new ForbiddenError(`Game does not have such player.`);
    }
    const playerState = this.gameState.players[playerNumber];
    const action = {
      player: playerNumber,
      name: actionName,
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

    const observer = jsonpatch.observe<GameState>(this.gameState);

    if (!playerState.playing) {
      throw new PlayingOutOfTurn();
    }
    this.gameDefinition.actions.handler(this.gameState, actionsToPlay);

    const patch = jsonpatch.generate(observer);
    jsonpatch.unobserve(this.gameState, observer);

    if (patch.length === 0) {
      return;
    }
    this.version += 1;
    pubsub.publish('GAME_CHANGED', this.id, { version: this.version, patch });
    if (this.gameState.end) {
      pubsub.complete('GAME_CHANGED', this.id);
    }
  }

  storeAction(action: GameAction): number {
    if (this.storedActions.has(action.player)) {
      throw new PlayingTwice();
    }
    this.storedActions.set(action.player, action);
    return this.storedActions.size;
  }

  getStoredActions(id: GameID): GameAction[] {
    return Array.from(this.storedActions.values());
  }
}
