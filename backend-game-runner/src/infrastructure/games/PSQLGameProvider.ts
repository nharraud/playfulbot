import { GameConfig, GameProvider } from "~game-runner/core/use-cases/game-scheduling/GameProvider";
import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { BackendGameDefinition } from "playfulbot-game-backend";
import { PlayerAssignment } from "~game-runner/core/entities/Game";

interface GameRow {
  id: string,
  game_def_id: string,
  players: PlayerAssignment[],
}

type GameDefinitionsProvider = (gameDefId: string) => Promise<BackendGameDefinition>;

export class PSQLGameProvider implements GameProvider {
  #runnerID: string | undefined;
  #gameDefinitionsProvider: GameDefinitionsProvider;

  constructor(gameDefinitionsProvider: GameDefinitionsProvider) {
    this.#gameDefinitionsProvider = gameDefinitionsProvider;
  }

  init() {
    return db.default.tx(async (tx) => {
      const response = await tx.one<{id: string}>('INSERT INTO game_runners DEFAULT VALUES RETURNING id');
      this.#runnerID = response.id;
    });
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
}