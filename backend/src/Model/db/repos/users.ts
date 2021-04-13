/* eslint no-template-curly-in-string: "off" */

import { IDatabase, IMain } from 'pg-promise';
import { DbUser, UserID } from '~playfulbot/types/database';
import { DEFAULT } from '~playfulbot/model/db/repos/helpers';

export class UsersRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async add(username: string, password: Buffer, id: string = undefined): Promise<DbUser> {
    const query = `INSERT INTO users(id, username, password)
                   VALUES($[id], $[username], $[password])
                   RETURNING *`;
    return this.db.one(query, { username, password, id: id || DEFAULT });
  }

  async getByName(username: string): Promise<DbUser | null> {
    return this.db.oneOrNone('SELECT * FROM users WHERE username = $[username]', { username });
  }

  async getByID(id: UserID): Promise<DbUser | null> {
    return this.db.oneOrNone('SELECT * FROM users WHERE id = $[id]', { id });
  }
}
