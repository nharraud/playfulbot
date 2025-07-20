import { GameCancelled, GameConfig, GameNotificationListener, GameProvider, StopListeningHandler } from "~game-runner/core/use-cases/game-scheduling/GameProvider";
import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { BackendGameDefinition } from "playfulbot-game-backend";
import { PlayerAssignment } from "~game-runner/core/entities/Game";
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { serverConfig } from "~game-runner/serverConfig";

interface GameRow {
  id: string,
  game_def_id: string,
  players: PlayerAssignment[],
}

type GameDefinitionsProvider = (gameDefId: string) => Promise<BackendGameDefinition>;

type GameRunnerId = string;

type GameRunnerNotification = {
  id: string,
  status: string,
  cancelled: boolean,
  runner_id: GameRunnerId,
}
export class PSQLGameProvider implements GameProvider {
  #runnerID: string | undefined;
  #gameDefinitionsProvider: GameDefinitionsProvider;
  #connection: pgPromise.IConnected<unknown, pg.IClient>;
  #listeners: Array<GameNotificationListener> = [];
  #closed: boolean = false;
  readonly #graphqlUrl: string;
  readonly #grpcUrl: string;

  constructor({ gameDefinitionsProvider, graphqlUrl, grpcUrl}: { gameDefinitionsProvider: GameDefinitionsProvider, graphqlUrl?: string, grpcUrl?: string }) {
    this.#gameDefinitionsProvider = gameDefinitionsProvider;
    this.#graphqlUrl = graphqlUrl || serverConfig.EXPOSED_GRAPHQL_URL;
    this.#grpcUrl = grpcUrl || serverConfig.EXPOSED_GRPC_URL;
  }

  async init() {
    await db.default.tx(async (tx) => {
      const response = await tx.one<{id: string}>(
        'INSERT INTO game_runners(graphql_url, grpc_url) VALUES ($[graphqlUrl], $[grpcUrl]) RETURNING id',
        { graphqlUrl: this.#graphqlUrl, grpcUrl: this.#grpcUrl }
      );
      this.#runnerID = response.id;
    });
    
    this.#connection = await db.default.connect({direct: true}) as pgPromise.IConnected<unknown, pg.IClient>;

    this.#connection.client.on('notification', async (data) => {
        if (!data.payload) {
          console.warn('[PSQLGameProvider] notification without payload');
          return;
        }
        const notification = JSON.parse(data.payload) as GameRunnerNotification;
        if (notification.cancelled) {
          for (const listener of this.#listeners) {
            listener(new GameCancelled(notification.id));
          }
        }
    });
    await this.#connection.none('LISTEN $1:name', `runner_${this.#runnerID}`)
  }

  async fetchGame(): Promise<GameConfig> {
    if (!this.#runnerID) {
      await this.init();
    }
    const fetchGameRequest = `SELECT * from fetch_game($[runnerID]);`;
    let gameRow: GameRow;
    await db.default.tx(async (tx) => {
      gameRow = await tx.oneOrNone<GameRow>(fetchGameRequest, { runnerID: this.#runnerID })
    });
    const gameDefinition = await this.#gameDefinitionsProvider(gameRow.game_def_id);
    return {
      id: gameRow.id,
      gameDefinition,
      players: gameRow.players,
    }
  }

  onNotification(listener: GameNotificationListener): StopListeningHandler {
      this.#listeners.push(listener);
      return () => {
        const index = this.#listeners.indexOf(listener);
        this.#listeners.splice(index, 1);
      };
  }

  async close() {
    if (this.#closed) {
      return;
    }
    this.#closed = true;
    if (!this.#runnerID) {
      return;
    }
    await this.#connection.none('UNLISTEN $1:name', `runner_${this.#runnerID}`).catch(error => {
      // FIXME use logger
      console.error('Error caught when PSQL UNLISTEN', error);
    });
    await this.#connection.done();
  }
}