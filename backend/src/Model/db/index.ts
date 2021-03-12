import pgPromise, { IInitOptions, IDatabase, IMain } from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { IExtensions, TeamsRepository, TournamentsRepository, UsersRepository } from './repos';

type DB = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
  extend(obj: DB, dc: unknown) {
    /* eslint-disable no-use-before-define */
    obj.users = new UsersRepository(obj, dbPGP);
    obj.tournaments = new TournamentsRepository(obj, dbPGP);
    obj.teams = new TeamsRepository(obj, dbPGP);
    /* eslint-enable no-use-before-define */
  },
};

const dbPGP = pgPromise(initOptions);

const db: DB = dbPGP({
  database: 'playfulbot',
  port: 5432,
  user: 'playfulbot_backend',
  password: process.env.DB_PASSWORD,
});

export default db;

export function createAdminDB(): pgPromise.IDatabase<unknown, pg.IClient> {
  const adminPGP = pgPromise();

  return adminPGP({
    database: 'postgres',
    port: 5432,
    user: 'playfulbot_backend',
    password: process.env.DB_PASSWORD,
  });
}
