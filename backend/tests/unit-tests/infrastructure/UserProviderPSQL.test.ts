
import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';

import { dropTestDB, initTestDB } from '../../utils/psql';
import { UserProviderPSQL } from '~playfulbot/infrastructure/providers/UserProviderPSQL';
import { User } from '~playfulbot/core/entities/Users';
import { randomUUID } from 'crypto';
import { UsernameAlreadyTaken } from '~playfulbot/core/use-cases/interfaces/UserProvider';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';
import { mockContextFixture } from 'tests/utils/fixtures';

async function userFixture({ ctx }: Omit<TestFixtures, 'user'>, use: any) {
  const provider = new UserProviderPSQL();
  const user = await provider.createUser(ctx, {
    username: 'Alice',
    password: 'mypassword'
  });
  await use(user);
}

interface TestFixtures {
  ctx: ContextPSQL,
  user: User
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  user: userFixture
});

describe('infrastructure/games/UserProviderPSQL', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('createUser', () => {
    test('should create user', async ({ ctx }) => {
      const provider = new UserProviderPSQL();
      const user = await provider.createUser(ctx, {
        username: 'Alice',
        password: 'mypassword'
      });
      expect(user).toEqual({
        id: expect.any(String),
        username: 'Alice'
      });
    });

    test('should throw an error when username is too short', async ({ ctx }) => {
      const provider = new UserProviderPSQL();
      const userPromise = provider.createUser(ctx, {
        username: 'a',
        password: 'mypassword'
      });
      await expect(userPromise).rejects.toThrowError('Invalid user');
    });

    test('should throw an error when username is too long', async ({ ctx }) => {
      const provider = new UserProviderPSQL();
      const userPromise = provider.createUser(ctx, {
        username: '123456789123456789',
        password: 'mypassword'
      });
      await expect(userPromise).rejects.toThrowError('Invalid user');
    });

    test('should return UsernameAlreadyTaken when username is already taken', async ({ ctx, user }) => {
      const provider = new UserProviderPSQL();
      const userPromise = await provider.createUser(ctx, {
        username: 'Alice',
        password: 'mypassword'
      });
      await expect(userPromise).instanceOf(UsernameAlreadyTaken);
    });
  });

  describe('getUserByName', () => {
    test('should find user by name', async ({ ctx, user }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByName(ctx, 'Alice');
      expect(foundUser).toEqual(user);
    });

    test('should return password hash only when requested', async ({ ctx, user }) => {
      const provider = new UserProviderPSQL();
      const foundUser1 = await provider.getUserByName(ctx, 'Alice');
      expect(foundUser1.passwordHash).toBeUndefined();

      const foundUser2 = await provider.getUserByName(ctx, 'Alice', true);
      expect(foundUser2.passwordHash).not.toBeUndefined();
    });

    test('should return null when no user is found', async ({ ctx }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByName(ctx, 'Unknown');
      expect(foundUser).toBeNull();
    });
  });

  describe('getUserByID', () => {
    test('should find user by id', async ({ ctx, user }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByID(ctx, user.id);
      expect(foundUser).toEqual(user);
    });

    test('should return null when no user is found', async ({ ctx }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.getUserByID(ctx, randomUUID());
      expect(foundUser).toBeNull();
    });
  });

  describe('userExists', () => {
    test('should return true when user exists', async ({ ctx, user }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.userExists(ctx, user.id);
      expect(foundUser).toEqual(true);
    });

    test('should return false when user does not exist', async ({ ctx }) => {
      const provider = new UserProviderPSQL();
      const foundUser = await provider.userExists(ctx, randomUUID());
      expect(foundUser).toEqual(false);
    });
  });

  // TODO test getUsersByTeam
});
