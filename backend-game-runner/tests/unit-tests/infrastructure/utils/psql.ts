import { createDB, dropDB } from 'playfulbot-backend-commons/lib/model/db/db_admin';
import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { config } from 'playfulbot-backend-commons/lib/model/db/config';
import { randomUUID } from 'crypto';
import { GameID } from '~game-runner/core/entities/base-types';

let OLD_DATABASE_NAME: string;
export async function initTestDB() {
  OLD_DATABASE_NAME = config.DATABASE_NAME;
  config.DATABASE_NAME = `testdb-${randomUUID()}`.replaceAll('-', '_');
  await dropDB();
  await createDB();
}

export async function dropTestDB() {
  await dropDB();
  config.DATABASE_NAME = OLD_DATABASE_NAME;
}

export async function cancelGame(gameId: GameID): Promise<boolean> {
  const cancelGameRequest = `SELECT * from cancel_game($[gameId]);`;
  const result = await db.default.one<{ cancel_game: boolean }>(cancelGameRequest, { gameId });
  return result.cancel_game;
}