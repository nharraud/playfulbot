import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '~playfulbot/Model/db';

import { User, UserID } from '~playfulbot/types/backend';

export async function createUser(name: string, password: string, id?: UserID): Promise<User> {
  // Salt round should be at least 12.
  // See https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt
  const passwordHash = await bcrypt.hash(password, 12);
  const user = db.users.add(name, Buffer.from(passwordHash, 'utf8'), id);
  return user;
}

export function getUserByName(username: string): Promise<User> {
  return db.users.getByName(username);
}

export function getUserByID(id: UserID): Promise<User> {
  return db.users.getByID(id);
}
