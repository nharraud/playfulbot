/* eslint no-template-curly-in-string: "off" */

import { IDatabase, IMain } from 'pg-promise';
import { User } from '~playfulbot/types/backend';
import { DEFAULT } from '~playfulbot/Model/db/repos/helpers';

export class UsersRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async add(username: string, password: Buffer, id: string = undefined): Promise<User> {
    const query = `INSERT INTO users(id, username, password)
                   VALUES($[id], $[username], $[password])
                   RETURNING *`;
    return this.db.one(query, { username, password, id: id || DEFAULT });
  }

  async getByName(username: string): Promise<User> {
    return this.db.oneOrNone('SELECT * FROM users WHERE username = $[username]', { username });
  }

  async getByID(id: string): Promise<User> {
    return this.db.oneOrNone('SELECT * FROM users WHERE id = $[id]', { id });
  }
}
