import { randomUUID } from 'crypto';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { DB } from 'playfulbot-backend-commons/lib/model/db/index';
import { GameID } from 'playfulbot-game';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';
import { ArenaID, GameRunnerId } from '~playfulbot/core/entities/base-types';
import { GameRef, GameRefWithDate } from '~playfulbot/core/entities/GameRef';
import { GameRepository } from '~playfulbot/core/use-cases/interfaces/GameRepository';
import { AsyncStream } from 'mem-pubsub/lib/AsyncStream';
import { VersionedAsyncIterator } from 'mem-pubsub/lib/VersionedAsyncIterator';
import { TransformAsyncIterator } from 'mem-pubsub/lib/TransformAsyncIterator'
import { DeferredPromise } from '~playfulbot/utils/DeferredPromise';
import { PlayerID } from '~playfulbot/core/entities/Players';
import { CombinedAsyncIterator } from 'mem-pubsub/lib/CombinedAsyncIterator';
import { Game, GameStatus } from '~playfulbot/core/entities/Game';
import { GameDefinitionID } from 'playfulbot-config-loader';

type GameNotification = {
  id: string,
  started_at: string,
  arena_id?: string,
  players: PlayerAssignment[],
  runner_id: GameRunnerId,
}

interface VersionedGameRef extends GameRef {
  gameId: GameID,
  runnerId?: GameRunnerId,
  version: string,
};


/* eslint-disable camelcase */
export interface DbGame {
  id: GameID;
  game_def_id: GameDefinitionID,
  started_at: string;
  players: PlayerAssignment[],
  arena_id?: string,
  runner_id?: GameRunnerId,
  status: GameStatus,
  cancelled: boolean,
}
/* eslint-enable */

function buildGame(data: DbGame): Game {
  const result: Game = {
    gameId: data.id,
    gameDefId: data.game_def_id,
    startedAt: data.started_at,
    players: data.players,
    arenaId: data.arena_id,
    runnerId: data.runner_id,
    status: data.status,
    cancelled: data.cancelled,
  };
  return result;
}

/**
 * GameRepository based on PostgreSQL. When we add games, the game runner servers fetch the game and notify
 * every backend server which listens for Debug Arena changes and Player games changes.
 */
export class GameRepositoryPSQL implements GameRepository {
  #connection : pgPromise.IConnected<unknown, pg.IClient>;
  #closed = false;
  #arenasStreams = new Map<GameID, Promise<AsyncStream<VersionedGameRef>[]>>();
  #playerStreams = new Map<GameID, Promise<AsyncStream<GameRef>[]>>();
  #db: DB;
  #closingPromises: Array<Promise<any>> = [];

  private constructor(db: DB) {
    this.#db = db;
  };

  async #init() {
    this.#connection = await this.#db.connect({direct: true});

    this.#connection.client.on('notification', async (data) => {
        // console.debug('[PSQLGameRepository] Received PSQL notification:', data);
        if (!data.payload) {
          console.warn('[PSQLGameRepository] game_scheduler notification without payload');
          return;
        }
        const gameNotification = JSON.parse(data.payload) as GameNotification;
        if (gameNotification.arena_id && data.channel === `arena_${gameNotification.arena_id}`) {
          const arenaStreams = await this.#arenasStreams.get(gameNotification.arena_id);
          for (const stream of arenaStreams || []) {
            stream?.push({
              gameId: gameNotification.id,
              runnerId: gameNotification.runner_id,
              version: gameNotification.started_at,
            });
          }
        } else if (data.channel.startsWith('player_')) {
          const playerID = data.channel.substring(7);
          // const player = gameNotification.players.find(player => data.channel === `player_${player.playerID}`);
          const playerStreams = await this.#playerStreams.get(playerID);
          for (const stream of playerStreams || []) {
            stream?.push({
              gameId: gameNotification.id,
              runnerId: gameNotification.runner_id
            });
          }
        }
    });
  }

  isListeningOnPlayerGames(playerId: PlayerID): Boolean {
    return Boolean(this.#playerStreams.get(playerId));
  }

  isListeningOnArenaGames(arenaId: ArenaID): Boolean {
    return Boolean(this.#arenasStreams.get(arenaId));
  }

  static async createRepository(db: DB) {
    const repository = new GameRepositoryPSQL(db);
    await repository.#init();
    return repository;
  }

  async close() {
    this.#closed = true;
    await Promise.allSettled(this.#closingPromises);
    await this.#connection.done();
  }

  async addGame({ gameDefId, players, arenaId }: { gameDefId: string, players: PlayerAssignment[], arenaId?: ArenaID }): Promise<GameRef> {
    const gameId = randomUUID();

    const addGameRequest = `
      INSERT INTO games(id, game_def_id, players, arena_id) VALUES($[gameId], $[gameDefId], $[players]::jsonb, $[arenaId]);
    `;
    await this.#db.oneOrNone<void>(addGameRequest, { gameId, gameDefId, players: JSON.stringify(players), arenaId });
    return { gameId };
  }

  async getFullGame(gameId: GameID): Promise<Game> {
    // FIXME: limit retrieved columns
    const getGameRequest = `SELECT * from games WHERE id = $[gameId];`;
    const result = await this.#db.oneOrNone<DbGame>(getGameRequest, { gameId });
    return buildGame(result);
  }

  async cancelGame(gameId: GameID): Promise<boolean> {
    const cancelGameRequest = `SELECT * from cancel_game($[gameId]);`;
    const result = await this.#db.one<{ cancel_game: boolean }>(cancelGameRequest, { gameId });
    return result.cancel_game;
  }

  /**
   * Get all active, i.e. with status = 'ended', games for a given player
   * @param playerId 
   * @returns the list of game references
   */
  async getGamesByPlayer(playerId: PlayerID): Promise<GameRef[]> {
    const selectGameRequest = `
      SELECT id, runner_id FROM games WHERE status != 'ended' AND players @@ $[condition]::jsonpath ORDER BY started_at;
    `;
    const result = await this.#db.manyOrNone<{ id: GameID, runner_id: GameRunnerId }>(selectGameRequest,
      { condition: `$.playerID == "${playerId}"` }
    );
    return result.map(value => ({ gameId: value.id, runnerId: value.runner_id}));
  }

  /**
   * Get the latest game created for the requested arena
   * @param arenaId
   * @returns The game reference or undefined if no game has been created yet
   */
  async getArenaLatestGame(arenaId: ArenaID): Promise<GameRefWithDate | undefined> {
    const request = 'SELECT games.id, games.runner_id, games.started_at FROM games JOIN arenas ON games.arena_id = arenas.id WHERE arenas.id = $[arenaId] ORDER BY started_at DESC LIMIT 1;';
    const result = await this.#db.oneOrNone<{ id: GameID, started_at: string, runner_id: GameRunnerId }>(request, { arenaId });
    if (result) {
      return {
        gameId: result.id,
        runnerId: result.runner_id,
        startedAt: result.started_at,
      };
    }
  }

  async #streamPlayerGameChanges(playerId: PlayerID): Promise<AsyncIterable<GameRef>> {
    const channel = `player_${playerId}`;
    return this.#streamChannel(channel, playerId, this.#playerStreams);
  }

  async #streamArenaGameChanges(arenaId: ArenaID): Promise<AsyncIterable<VersionedGameRef>> {
    const channel = `arena_${arenaId}`;
    return this.#streamChannel(channel, arenaId, this.#arenasStreams);
  }

  async streamArenaGames(arenaId: ArenaID): Promise<AsyncIterable<GameRef>> {
    // Stream first the game changes to not miss any game
    const arenaChanges = await this.#streamArenaGameChanges(arenaId);

    // Then ask for current games. There might be overlap with game changes.
    const versionnedStream = new VersionedAsyncIterator(arenaChanges[Symbol.asyncIterator](), async () => {
      const currentGame = await this.getArenaLatestGame(arenaId);
      if (currentGame?.runnerId) {
        const initGame: VersionedGameRef = {
          gameId: currentGame.gameId,
          runnerId: currentGame.runnerId,
          version: currentGame.startedAt,
        }
        return initGame;
      }
      // else the first game is not yet assigned to a game runner. Return the arena changes. The current
      // game will be returned via a notification as soon as it is assigned.
    });
    return new TransformAsyncIterator(versionnedStream[Symbol.asyncIterator](), (gameRef: VersionedGameRef) => {
      delete gameRef.version;
      return gameRef as GameRef;
    });
  }

  async streamPlayerGames(playerId: PlayerID): Promise<AsyncIterable<GameRef>> {
    // Stream first the game changes to not miss any game
    const playerGameChanges = await this.#streamPlayerGameChanges(playerId);
    // Then ask for current games. There might be overlap with game changes.
    const currentGames = await this.getGamesByPlayer(playerId);
    const currentRunningGames = currentGames.filter(game => game.runnerId);
    if (currentRunningGames.length) {
      const initGames: GameRef[] = currentRunningGames.map(game => ({
        gameId: game.gameId,
        runnerId: game.runnerId
      }));

      const initStream = new AsyncStream<GameRef>();
      initStream.push(...initGames);
      initStream.complete();
      return new CombinedAsyncIterator<AsyncIterator<GameRef>[]>([initStream[Symbol.asyncIterator](), playerGameChanges[Symbol.asyncIterator]()]);
    } else {
      // The first game is not yet assigned to a game runner. Return the player changes.
      return playerGameChanges;
    }
  }

  async #streamChannel<K,T>(channel: string, key: K, streamsMap: Map<K, Promise<AsyncStream<T>[]>>) {
    let streams = await streamsMap.get(key);
    const stream = new AsyncStream<T>();
    if (!streams) {
      const promise = new DeferredPromise<AsyncStream<T>[]>();
      streams = [stream];
      streamsMap.set(key, promise.promise);
      await this.#connection.none('LISTEN $1:name', channel).catch(error => {
        const index = streams.findIndex(str => str === stream);
        streams.splice(index, 1);
        stream.return();
        throw error;
      });
      promise.resolve(streams);
    } else {
      streams.push(stream);
    }
    stream.waitOnComplete().then(() => {
      const index = streams.findIndex(str => str === stream);
      streams.splice(index, 1);
      if (streams.length === 0) {
        streamsMap.delete(key);
        if (!this.#closed) {
          const ubsubscribePromise = this.#connection.none('UNLISTEN $1:name', channel).catch(error => {
            // FIXME use logger
            console.error('Error caught when PSQL UNLISTEN', error);
          });
          this.#closingPromises.push(ubsubscribePromise);
          return ubsubscribePromise;
        }
      }
    });
    return stream;
  }
}