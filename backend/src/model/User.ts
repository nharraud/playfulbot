import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { db } from '~playfulbot/model/db';
import { DbOrTx, DEFAULT } from './db/helpers';
import { TeamID } from './Team';

export type UserID = string;

/* eslint-disable camelcase */
interface DbUser {
  id: UserID;
  username: string;
  password: Buffer;
}
/* eslint-enable */

export class User {
  id: UserID;
  username: string;
  password: Buffer;

  constructor(data: DbUser) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
  }

  static async create(
    username: string,
    password: string,
    dbOrTX: DbOrTx,
    id?: UserID
  ): Promise<User> {
    // Salt round should be at least 12.
    // See https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt
    const passwordHash = await bcrypt.hash(password, 12);
    const query = `INSERT INTO users(id, username, password)
                   VALUES($[id], $[username], $[passwordHash])
                   RETURNING *`;
    const data = await dbOrTX.one<DbUser>(query, { username, passwordHash, id: id || DEFAULT });

    return new User(data);
  }

  static async getByName(username: string, dbOrTX: DbOrTx): Promise<User | null> {
    const data = await dbOrTX.oneOrNone<DbUser>(
      'SELECT * FROM users WHERE username = $[username]',
      { username }
    );
    return new User(data);
  }

  static async getByID(id: UserID, dbOrTX: DbOrTx): Promise<User | null> {
    const data = await dbOrTX.oneOrNone<DbUser>('SELECT * FROM users WHERE id = $[id]', { id });
    return new User(data);
  }

  static async exists(id: UserID, dbOrTX: DbOrTx): Promise<boolean> {
    const result = await dbOrTX.oneOrNone<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM users WHERE id = $[id])',
      { id }
    );
    return result.exists || false;
  }

  static async getByTeam(teamID: TeamID, dbOrTX: DbOrTx): Promise<User[]> {
    const query = `SELECT users.* FROM team_memberships
                    JOIN users ON users.id = team_memberships.user_id
                    WHERE team_memberships.team_id = $[teamID] ORDER BY users.username`;
    const rows = await dbOrTX.manyOrNone(query, { teamID });
    return rows.map((row) => new User(row));
  }
}
