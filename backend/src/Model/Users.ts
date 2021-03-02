import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { User, UserID } from '~playfulbot/types/backend';

const users: User[] = [];

export async function createUser(name: string, password: string, id?: UserID): Promise<User> {
  // Salt round should be at least 12.
  // See https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt
  const passwordHash = await bcrypt.hash(password, 12);
  const user: User = {
    id: id || uuidv4(),
    username: name,
    password: passwordHash,
  };
  users.push(user);
  return user;
}

export function getUserByName(username: string): User {
  return users.find((user) => user.username === username);
}

export function getUserByID(id: UserID): User {
  return users.find((user) => user.id === id);
}
