import sql from '~playfulbot/model/db/sql';
import db, { createAdminDB } from '~playfulbot/model/db';

export async function dropDB(): Promise<void> {
  const adminDB = createAdminDB();
  try {
    await adminDB.none('DROP DATABASE playfulbot');
  } finally {
    await adminDB.$pool.end();
  }
}

export async function createDB(): Promise<void> {
  const adminDB = createAdminDB();
  try {
    await adminDB.none('CREATE DATABASE playfulbot');
    await adminDB.none('GRANT ALL PRIVILEGES ON DATABASE playfulbot TO playfulbot_backend;');
    await db.none(sql.init);
  } finally {
    await adminDB.$pool.end();
  }
}
