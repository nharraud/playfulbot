import { pubsub } from '~playfulbot/pubsub';
import { createPlayerToken } from '~playfulbot/graphqlResolvers/authentication';
import { JWToken } from '~playfulbot/types/token';
import { GameID } from './Game';
import { ConflictError } from '~playfulbot/errors';

export type PlayerID = string;

export interface PlayerAccess {
  id: PlayerID;
  token: JWToken;
}

export class Player {
  private static players = new Map<PlayerID, Player>();
  private _connected = false;
  version = 0;
  games = new Set<GameID>();

  private constructor(readonly id: PlayerID) {}

  static create(id: PlayerID): Player {
    if (Player.players.has(id)) {
      throw new ConflictError('Cannot create a two players with the same ID');
    }
    const player = new Player(id);
    Player.players.set(id, player);
    return player;
  }

  static getPlayer(id: PlayerID): Player | undefined {
    return Player.players.get(id);
  }

  get token(): JWToken {
    return createPlayerToken(this.id);
  }

  get connected(): boolean {
    return this._connected;
  }

  updateConnectionStatus(status: boolean): void {
    this._connected = status;
    pubsub.publish('PLAYER_CONNECTION_CHANGED', this.id, { connected: status });
  }

  addGames(games: GameID[]): void {
    this.version += 1;
    for (const gameID of games) {
      this.games.add(gameID);
    }
    pubsub.publish('NEW_PLAYER_GAMES', this.id, { games, version: this.version });
  }

  removeGames(games: GameID[]): void {
    for (const gameID of games) {
      this.games.delete(gameID);
    }
  }
}
