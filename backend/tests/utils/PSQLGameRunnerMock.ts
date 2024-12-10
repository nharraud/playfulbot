import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';

interface GameRow {
  id: string,
  game_def_id: string,
  players: PlayerAssignment[],
}

export class PSQLGameRunnerMock {
  #runnerID: string | undefined;

  private constructor() {}

  #init() {
    return db.default.tx(async (tx) => {
      const response = await tx.one<{id: string}>('INSERT INTO game_runners DEFAULT VALUES RETURNING id');
      this.#runnerID = response.id;
    });
  }

  get runnerId() {
    return this.#runnerID;
  }

  static async create() {
    const provider = new PSQLGameRunnerMock();
    await provider.#init();
    return provider;
  }

  async fetchGame(): Promise<GameRow> {
    if (!this.#runnerID) {
      await this.#init();
    }
    const fetchGameRequest = `SELECT * from fetch_game($[runnerID]);`;
    return db.default.oneOrNone<GameRow>(fetchGameRequest, { runnerID: this.#runnerID });
  }
}