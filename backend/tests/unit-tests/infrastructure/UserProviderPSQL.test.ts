
import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';

import { dropTestDB, initTestDB } from '../../utils/psql';
import { UserProviderPSQL } from '~playfulbot/infrastructure/providers/UserProviderPSQL';
import { User } from '~playfulbot/core/entities/Users';
import { randomUUID } from 'crypto';
import { createMockContext } from '../../utils/context';

async function userFixture({}, use: any) {
  const provider = new UserProviderPSQL();
  const user = await provider.createUser(createMockContext(), {
    username: 'Alice',
    password: 'mypassword'
  });
  await use(user);
}

interface TestFixtures {
  user: User
}

const test = baseTest.extend<TestFixtures>({
  user: userFixture
});

describe('infrastructure/games/UserProviderPSQL', () => {
  beforeEach(async () => {
    await initTestDB();
  });

  afterEach(async () => {
    await dropTestDB();
  });

  describe('createUser', () => {
    test('should create user', async () => {
      const provider = new UserProviderPSQL();
      const user = await provider.createUser(createMockContext(), {
        username: 'Alice',
        password: 'mypassword'
      });
      expect(user).toEqual({
        id: expect.any(String),
        username: 'Alice'
      });
    });

    test('should throw an error when username is too short', async () => {
      const provider = new UserProviderPSQL();
      const userPromise = provider.createUser(createMockContext(), {
        username: 'a',
        password: 'mypassword'
      });
      await expect(userPromise).rejects.toThrowError('Invalid user');
    });
  });

  describe('getUserByName', () => {
    test('should find user by name', async ({ user }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByName(createMockContext(), 'Alice');
      expect(foundUser).toEqual(user);
    });

    test('should return password hash only when requested', async ({ user }) => {
      const provider = new UserProviderPSQL();
      const foundUser1 = await provider.getUserByName(createMockContext(), 'Alice');
      expect(foundUser1.passwordHash).toBeUndefined();

      const foundUser2 = await provider.getUserByName(createMockContext(), 'Alice', true);
      expect(foundUser2.passwordHash).not.toBeUndefined();
    });

    test('should return null when no user is found', async ({}) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByName(createMockContext(), 'Unknown');
      expect(foundUser).toBeNull();
    });
  });

  describe('getUserByID', () => {
    test('should find user by id', async ({ user }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByID(createMockContext(), user.id);
      expect(foundUser).toEqual(user);
    });

    test('should return null when no user is found', async ({}) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByID(createMockContext(), randomUUID());
      expect(foundUser).toBeNull();
    });
  });

  describe('userExists', () => {
    test('should return true when user exists', async ({ user }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.userExists(createMockContext(), user.id);
      expect(foundUser).toEqual(true);
    });

    test('should return false when user does not exist', async ({}) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.userExists(createMockContext(), randomUUID());
      expect(foundUser).toEqual(false);
    });
  });

  // TODO test getUsersByTeam
});
