import sql from '~playfulbot/model/db/sql';
import { db } from '~playfulbot/model/db';
import { config } from '~playfulbot/model/db/config';

export async function dropDB(): Promise<void> {
  await db.disconnectDefault();
  try {
    await db.admin.none(`DROP DATABASE IF EXISTS ${config.DATABASE_NAME}`);
  } finally {
    await db.disconnectAdmin();
  }
}

export async function createDB(): Promise<void> {
  await db.disconnectDefault();
  try {
    await db.admin.none(`CREATE DATABASE ${config.DATABASE_NAME}`);
    await db.admin.none(
      `GRANT ALL PRIVILEGES ON DATABASE ${config.DATABASE_NAME} TO ${config.DATABASE_USER};`
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
