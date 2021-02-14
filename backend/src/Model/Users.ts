import { User } from '~playfulbot/types/backend';

const users: User[] = [
  {
    id: 'user1',
    username: 'test',
    password: '$2b$10$jtFkEfx5ph5.4wkoMx0L5Ow1lTbUTtIlCxMXFXCV3ax/cB8fA2vmq', // = secret
  },
];

export function getUserByName(username: string): User {
  return users.find((user) => user.username === username);
}

export function getUserById(id: string): User {
  return users.find((user) => user.id === id);
}
