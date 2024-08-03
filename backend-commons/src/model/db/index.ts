import pgPromise, { IInitOptions, IDatabase, IMain } from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { config } from './config';
import { fixTimeParsing } from './fixTimeParsing';

fixTimeParsing();

export type DB = IDatabase<unknown>;
export type TX = pgPromise.ITask<unknown>;

const dbPGP = pgPromise();

class Database {
  private _db: DB;
  private _adminDB: DB;

  get default() {
    if (this._db === undefined) {
      this._db = dbPGP({
        database: config.DATABASE_NAME,
        host: config.DATABASE_HOST,
        port: config.DATABASE_PORT,
        user: config.DATABASE_USER,
        password: config.DATABASE_PASSWORD,
      });
    }
    return this._db;
  }

  get admin() {
    if (this._adminDB === undefined) {
      if (!config.DATABASE_ADMIN_USER) {
        throw new Error('DATABASE_ADMIN_USER env variable is not set');
      }
      const adminPGP = pgPromise();

      this._adminDB = adminPGP({
        database: 'postgres',
        host: config.DATABASE_HOST,
        port: config.DATABASE_PORT,
        user: config.DATABASE_ADMIN_USER,
        password: config.DATABASE_ADMIN_PASSWORD,
      });
    }
    return this._adminDB;
  }

  async disconnectDefault(): Promise<void> {
    if (this._db) {
      await this._db.$pool.end();
      this._db = undefined;
    }
  }

  async disconnectAdmin(): Promise<void> {
    if (this._adminDB) {
      await this._adminDB.$pool.end();
      this._adminDB = undefined;
    }
  }
}

export const db = new Database();
