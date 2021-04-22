import { pubsub } from '~playfulbot/pubsub';
import { createPlayerToken } from '~playfulbot/graphqlResolvers/authentication';
import { JWToken } from '~playfulbot/types/token';
import { GameID } from './Game';

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

  static getPlayer(id: PlayerID, createIfMissing?: true): Player;
  static getPlayer(id: PlayerID, createIfMissing?: boolean): Player | undefined {
    let player = Player.players.get(id);
    if (player === undefined && createIfMissing) {
      player = new Player(id);
      Player.players.set(id, player);
    }
    return player;
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
