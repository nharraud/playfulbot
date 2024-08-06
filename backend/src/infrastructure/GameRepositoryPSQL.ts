import { randomUUID } from 'crypto';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { DB } from 'playfulbot-backend-commons/lib/model/db/index';
import { GameID } from 'playfulbot-game';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';
import { DebugArenaID, GameRunnerId } from '~playfulbot/core/entities/base-types';
import { GameRef, GameRefWithDate } from '~playfulbot/core/use-cases/GameRef';
import { GameRepository } from '~playfulbot/core/use-cases/GameRepository';
import logger from '~playfulbot/logging';
import { AsyncStream } from 'mem-pubsub/lib/AsyncStream';
import { VersionedAsyncIterator } from '~playfulbot/pubsub/VersionedAsyncIterator';
import { TransformAsyncIterator } from '~playfulbot/pubsub/TransformedAsyncIterator'
import { DeferredPromise } from '~playfulbot/utils/DeferredPromise';

type GameNotification = {
  id: string,
  started_at: string,
  arena: string,
  players: PlayerAssignment,
  runner_id: GameRunnerId,
}

interface VersionedGameRef extends GameRef {
  gameId: GameID,
  runnerId?: GameRunnerId,
  version: string,
};

/**
 * GameRepository based on PostgreSQL. When we add games, the game runner servers fetch the game and notify
 * every backend server which listens for Debug Arena changes and Player games changes.
 */
export class GameRepositoryPSQL implements GameRepository {
  #connection : pgPromise.IConnected<unknown, pg.IClient>;
  #closed = false;
  #arenasStreams = new Map<GameID, Promise<AsyncStream<VersionedGameRef>[]>>();
  #db: DB;

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
        if (gameNotification.arena && data.channel === `arena_${gameNotification.arena}`) {
          const arenaStreams = await this.#arenasStreams.get(gameNotification.arena);
          for (const stream of arenaStreams || []) {
            stream?.push({
              gameId: gameNotification.id,
              runnerId: gameNotification.runner_id,
              version: gameNotification.started_at,
            });
          }
        }
    });
  }

  isListeningOnArenaGames(arenaId: DebugArenaID): Boolean {
    return Boolean(this.#arenasStreams.get(arenaId));
  }

  static async createRepository(db: DB) {
    const repository = new GameRepositoryPSQL(db);
    await repository.#init();
    return repository;
  }

  async close() {
    this.#closed = true;
    await this.#connection.done();
  }

  async addGame({ gameDefId, players, arena }: { gameDefId: string, players: PlayerAssignment[], arena?: DebugArenaID }): Promise<GameRef> {
    const gameId = randomUUID();

    const addGameRequest = `
      INSERT INTO games(id, game_def_id, players, arena) VALUES($[gameId], $[gameDefId], $[players]::json[], $[arena]);
    `;
    await this.#db.oneOrNone<void>(addGameRequest, { gameId, gameDefId, players, arena });
    return { gameId };
  }

  async getArenaLatestGame(arenaId: DebugArenaID): Promise<GameRefWithDate | undefined> {
    const addArenaRequest = 'SELECT games.id, games.runner_id, games.started_at FROM games JOIN arena ON games.arena = arena.id WHERE arena.id = $[arenaId] ORDER BY started_at DESC LIMIT 1;';
    const result = await this.#db.oneOrNone<{ id: GameID, started_at: string, runner_id: GameRunnerId }>(addArenaRequest, { arenaId });
    if (result) {
      return {
        gameId: result.id,
        runnerId: result.runner_id,
        startedAt: result.started_at,
      };
    }
  }

  async #streamArenaGameChanges(arenaId: DebugArenaID): Promise<AsyncIterable<VersionedGameRef>> {
    const channel = `arena_${arenaId}`;
    let streams = await this.#arenasStreams.get(arenaId);
    const stream = new AsyncStream<VersionedGameRef>();
    if (!streams) {
      const promise = new DeferredPromise<AsyncStream<VersionedGameRef>[]>();
      streams = [stream];
      this.#arenasStreams.set(arenaId, promise.promise);
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
        this.#arenasStreams.delete(arenaId);
        if (!this.#closed) {
          return this.#connection.none('UNLISTEN $1:name', channel).catch(error => {
            logger.error(error, 'Error caught when PSQL UNLISTEN arena');
          });
        }
      }
    });
    return stream;
  }

  async streamArenaGames(arenaId: DebugArenaID): Promise<AsyncIterable<GameRef> | undefined> {
    const currentGame = await this.getArenaLatestGame(arenaId);
    if (!currentGame) {
      return;
    }
    const arenaChanges = await this.#streamArenaGameChanges(arenaId);
    let versionnedStream: AsyncIterable<VersionedGameRef>;
    if (currentGame.runnerId) {
      const initGame: VersionedGameRef = {
        gameId: currentGame.gameId,
        runnerId: currentGame.runnerId,
        version: currentGame.startedAt,
      }
      versionnedStream = new VersionedAsyncIterator(arenaChanges[Symbol.asyncIterator](), () => Promise.resolve(initGame));
    } else {
      // The first game is not yet assigned to a game runner. Return the arena changes. The current game will be
      // returned via a notification as soon as it is assigned.
      versionnedStream = arenaChanges;
    }
    return new TransformAsyncIterator(versionnedStream[Symbol.asyncIterator](), (gameRef: VersionedGameRef) => {
      delete gameRef.version;
      return gameRef as GameRef;
    });
  }
}