/* eslint no-template-curly-in-string: "off" */

import { IDatabase, IMain } from 'pg-promise';
import { DbTournament, TournamentID } from '~playfulbot/types/database';
import { DEFAULT } from '~playfulbot/Model/db/repos/helpers';

export class TournamentsRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async add(name: string, id: string = undefined): Promise<DbTournament> {
    const query = `INSERT INTO tournaments(id, name)
                   VALUES($[id], $[name])
                   RETURNING *`;
    return this.db.one(query, { name, id: id || DEFAULT });
  }

  async getByName(name: string): Promise<DbTournament | null> {
    return this.db.oneOrNone('SELECT * FROM tournaments WHERE name = $[name]', { name });
  }

  async getByID(id: TournamentID): Promise<DbTournament | null> {
    return this.db.oneOrNone('SELECT * FROM tournaments WHERE id = $[id]', { id });
  }
}
