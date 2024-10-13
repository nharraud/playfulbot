import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { GameID } from 'playfulbot-game';
import { PlayerAssignment } from '~game-runner/core/entities/Game';

export class PSQLGameRepository {
  async addGame({ gameDefId, players }: { gameDefId: string, players: PlayerAssignment[] }): Promise<GameID> {
    const addGameRequest = `
      INSERT INTO games(game_def_id, players) VALUES($[gameDefId], $[players]::jsonb) RETURNING id;
    `;
    let response: { id: GameID };
    await db.default.tx(async (tx) => {
      response = await tx.oneOrNone<{ id: GameID }>(addGameRequest, { gameDefId, players: JSON.stringify(players) });
    });
    return response.id;
  }
}