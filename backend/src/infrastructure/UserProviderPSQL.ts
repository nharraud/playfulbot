import bcrypt from 'bcrypt';
import { DEFAULT, isDatabaseError } from "playfulbot-backend-commons/lib/model/db/helpers";
import { TeamID } from './TeamProviderPSQL';
import { User, UserID } from '~playfulbot/core/entities/Users';
import { ContextPSQL } from './ContextPSQL';
import { ValidationError } from '~playfulbot/core/use-cases/Errors';
import { UserProvider } from '~playfulbot/core/use-cases/UserProvider';

interface DbUser {
  readonly id: UserID;
  username: string;
  password_hash: Buffer;
}

function buildUser(data: DbUser): User {
  const result: User = {
    id: data.id,
    username: data.username
  };
  if (data.password_hash) {
    result.passwordHash = data.password_hash;
  }
  return result;
}

export class UserProviderPSQL implements UserProvider<ContextPSQL> {

  async createUser(
    ctx: ContextPSQL,
    user: {
      username: string,
      password: string,
      id?: UserID
    }
  ): Promise<User> {
    // Salt round should be at least 12.
    // See https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt
    const passwordHash = await bcrypt.hash(user.password, 12);
    const query = `INSERT INTO users(id, username, password_hash)
                   VALUES($[id], $[username], $[passwordHash])
                   RETURNING id, username`;
    try {
      const data = await ctx.dbOrTx.one<DbUser>(query, { username: user.username, passwordHash, id: user.id || DEFAULT });
      return buildUser(data);
    } catch (err) {
      if (isDatabaseError(err) && err.constraint === 'users_username_check') {
        throw new ValidationError('Invalid user', { username: 'username must be at least 3 characters long' });
      }
      throw err;
    }
  }

  async getUserByName(ctx: ContextPSQL, username: string, withPassword = false): Promise<User | null> {
    const data = await ctx.dbOrTx.oneOrNone<DbUser>(
      `SELECT id, username ${ withPassword ? ', password': '' } FROM users WHERE username = $[username]`,
      { username }
    );
    return data ? buildUser(data) : null;
  }

  async getUserByID(ctx: ContextPSQL, id: UserID): Promise<User | null> {
    const data = await ctx.dbOrTx.oneOrNone<DbUser>('SELECT id, username FROM users WHERE id = $[id]', { id });
    return data ? buildUser(data) : null;
  }

  async userExists(ctx: ContextPSQL, id: UserID): Promise<boolean> {
    const result = await ctx.dbOrTx.oneOrNone<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM users WHERE id = $[id])',
      { id }
    );
    return result.exists || false;
  }

  async getUsersByTeam(ctx: ContextPSQL, teamID: TeamID): Promise<User[]> {
    const query = `SELECT users.id, users.username FROM team_memberships
                    JOIN users ON users.id = team_memberships.user_id
                    WHERE team_memberships.team_id = $[teamID] ORDER BY users.username`;
    const rows = await ctx.dbOrTx.manyOrNone(query, { teamID });
    return rows.map((row) => buildUser(row));
  }
}
