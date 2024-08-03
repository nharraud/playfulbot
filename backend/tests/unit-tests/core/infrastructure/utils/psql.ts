import { createDB, dropDB } from 'playfulbot-backend-commons/lib/model/db/db_admin';
import { config } from 'playfulbot-backend-commons/lib/model/db/config';
import { db } from 'playfulbot-backend-commons/lib/model/db';
import { DebugArenaID, GameRunnerId } from '~playfulbot/core/entities/base-types';
import { GameID } from 'playfulbot-game';

let OLD_DATABASE_NAME: string;
export async function initTestDB() {
  OLD_DATABASE_NAME = config.DATABASE_NAME;
  config.DATABASE_NAME = 'testdb';
  await dropDB();
  await createDB();
}

export async function dropTestDB() {
  await dropDB();
  config.DATABASE_NAME = OLD_DATABASE_NAME;
}

export function createArena(arenaId: DebugArenaID): Promise<void> {
    const addArenaRequest = 'INSERT INTO arena(id) VALUES($[arenaId]);';
    return db.default.oneOrNone<void>(addArenaRequest, { arenaId });
}

interface DBGame {
  id: GameID,
  runner_id: GameRunnerId,
  started_at: string,
}

export function getGame(gameId: GameID): Promise<DBGame> {
  const addArenaRequest = 'SELECT * from games WHERE id = $[gameId];';
  return db.default.oneOrNone<DBGame>(addArenaRequest, { gameId });
}