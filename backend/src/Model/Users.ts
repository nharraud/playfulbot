import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '~playfulbot/Model/db';

import { DbUser, UserID } from '~playfulbot/types/database';

export async function createUser(name: string, password: string, id?: UserID): Promise<DbUser> {
  // Salt round should be at least 12.
  // See https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt
  const passwordHash = await bcrypt.hash(password, 12);
  const user = db.users.add(name, Buffer.from(passwordHash, 'utf8'), id);
  return user;
}

export function getUserByName(username: string): Promise<DbUser | null> {
  return db.users.getByName(username);
}

export function getUserByID(id: UserID): Promise<DbUser | null> {
  return db.users.getByID(id);
}
