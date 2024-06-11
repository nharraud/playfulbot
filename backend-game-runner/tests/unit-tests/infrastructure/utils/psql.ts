import { createDB, dropDB } from 'playfulbot-backend-commons/lib/model/db/db_admin';
import { config } from 'playfulbot-backend-commons/lib/model/db/config';

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