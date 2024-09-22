import { db } from 'playfulbot-backend-commons/lib/model/db/index';
export class PSQLGameProvider {
    #runnerID;
    #gameDefinitionsProvider;
    constructor(gameDefinitionsProvider) {
        this.#gameDefinitionsProvider = gameDefinitionsProvider;
    }
    init() {
        return db.default.tx(async (tx) => {
            const response = await tx.one('INSERT INTO game_runners DEFAULT VALUES RETURNING id');
            this.#runnerID = response.id;
        });
    }
    async fetchGame() {
        if (!this.#runnerID) {
            await this.init();
        }
        const fetchGameRequest = `SELECT * from fetch_game($[runnerID]);`;
        let gameRow;
        await db.default.tx(async (tx) => {
            gameRow = await tx.oneOrNone(fetchGameRequest, { runnerID: this.#runnerID });
        });
        const gameDefinition = await this.#gameDefinitionsProvider(gameRow.game_def_id);
        return {
            id: gameRow.id,
            gameDefinition,
            players: gameRow.players,
        };
    }
}
//# sourceMappingURL=PSQLGameProvider.js.map