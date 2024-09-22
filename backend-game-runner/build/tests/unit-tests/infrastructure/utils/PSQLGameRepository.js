import { db } from 'playfulbot-backend-commons/lib/model/db/index';
export class PSQLGameRepository {
    async addGame({ gameDefId, players }) {
        const addGameRequest = `
      INSERT INTO games(game_def_id, players) VALUES($[gameDefId], $[players]::json[]) RETURNING id;
    `;
        let response;
        await db.default.tx(async (tx) => {
            response = await tx.oneOrNone(addGameRequest, { gameDefId, players });
        });
        return response.id;
    }
}
//# sourceMappingURL=PSQLGameRepository.js.map