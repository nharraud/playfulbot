import sql from '~playfulbot-commons/model/db/sql';
import { db } from '~playfulbot-commons/model/db';
import { config } from '~playfulbot-commons/model/db/config';

/**
 * Drop the database
 */
export async function dropDB(): Promise<void> {
  const dbName = config.DATABASE_NAME;
  await db.disconnectDefault();
  try {
    await db.admin.none(`DROP DATABASE IF EXISTS ${dbName}`);
  } finally {
    await db.disconnectAdmin();
  }
}

/**
 * Create the database
 */
export async function createDB(): Promise<void> {
  const dbName = config.DATABASE_NAME;
  const dbUser = config.DATABASE_USER;

  await db.disconnectDefault();
  try {
    await db.admin.none(`CREATE DATABASE ${dbName}`);
    await db.admin.none(
      `GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${dbUser};`
    );
    try {
      await db.default.none(sql.init);
    } finally {
      await db.disconnectDefault();
    }
  } finally {
    await db.disconnectAdmin();
  }
}
