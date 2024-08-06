
import { beforeEach, afterEach, describe, expect, test } from 'vitest';

import { dropTestDB, initTestDB } from './utils/psql';
import { UserProviderPLSQL } from '~playfulbot/infrastructure/UserProviderPSQL';
import { db } from 'playfulbot-backend-commons/lib/model/db';
import { createLogger } from './utils/logging';
import { User } from '~playfulbot/core/entities/Users';
import { randomUUID } from 'crypto';

async function userFixture({}, use: any) {
  const provider = new UserProviderPLSQL();
  const user = await provider.createUser({ dbOrTx: db.default, logger: createLogger() }, {
    username: 'Alice',
    password: 'mypassword'
  });
  await use(user)
}

interface TestFixtures {
  user: User
}

const ctest = test.extend<TestFixtures>({
  user: userFixture
})

describe('infrastructure/games/UserProviderPLSQL', () => {
  beforeEach(async () => {
    await initTestDB();
  });

  afterEach(async () => {
    await dropTestDB();
  });

  describe('createUser', () => {
    test('should create user', async () => {
      const provider = new UserProviderPLSQL();
      const user = await provider.createUser({ dbOrTx: db.default, logger: createLogger() }, {
        username: 'Alice',
        password: 'mypassword'
      });
      expect(user).toEqual({
        id: expect.any(String),
        username: 'Alice'
      });
    });

    test('should throw an error when username is too short', async () => {
      const provider = new UserProviderPLSQL();
      const userPromise = provider.createUser({ dbOrTx: db.default, logger: createLogger() }, {
        username: 'a',
        password: 'mypassword'
      });
      await expect(userPromise).rejects.toThrowError('Invalid user');
    });
  });

  describe('getUserByName', () => {
    ctest('should find user by name', async ({ user }) => {
      const provider = new UserProviderPLSQL();
      const foundUser = await provider.getUserByName({ dbOrTx: db.default, logger: createLogger() }, 'Alice');
      expect(foundUser).toEqual(user);
    });

    ctest('should return null when no user is found', async ({}) => {
      const provider = new UserProviderPLSQL();
      const foundUser = await provider.getUserByName({ dbOrTx: db.default, logger: createLogger() }, 'Unknown');
      expect(foundUser).toBeNull();
    });
  });

  describe('getUserByID', () => {
    ctest('should find user by id', async ({ user }) => {
      const provider = new UserProviderPLSQL();
      const foundUser = await provider.getUserByID({ dbOrTx: db.default, logger: createLogger() }, user.id);
      expect(foundUser).toEqual(user);
    });

    ctest('should return null when no user is found', async ({}) => {
      const provider = new UserProviderPLSQL();
      const foundUser = await provider.getUserByID({ dbOrTx: db.default, logger: createLogger() }, randomUUID());
      expect(foundUser).toBeNull();
    });
  });

  describe('userExists', () => {
    ctest('should return true when user exists', async ({ user }) => {
      const provider = new UserProviderPLSQL();
      const foundUser = await provider.userExists({ dbOrTx: db.default, logger: createLogger() }, user.id);
      expect(foundUser).toEqual(true);
    });

    ctest('should return false when user does not exist', async ({}) => {
      const provider = new UserProviderPLSQL();
      const foundUser = await provider.userExists({ dbOrTx: db.default, logger: createLogger() }, randomUUID());
      expect(foundUser).toEqual(false);
    });
  });
});
