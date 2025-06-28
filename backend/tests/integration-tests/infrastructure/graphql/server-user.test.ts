import { afterEach, beforeEach, describe, expect, test as baseTest, vi } from 'vitest';
import { dropTestDB } from '../../../utils/psql';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { graphqlFixture, graphqlFixtureType } from './fixtures/baseFixtures';
import { mockContextFixture } from '../../../utils/fixtures';

const userData = { username: 'testuser', password: 'testpassword' };

interface TestFixtures {
  ctx: Context<any>,
  graphql: graphqlFixtureType,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  graphql: graphqlFixture,
});

describe('graphql', () => {
  beforeEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.user.createUser(ctx, userData);
  });

  afterEach<TestFixtures>(async ({ ctx, graphql }) => {
    await graphql.server?.close();
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('Query/authenticatedUser', () => {
    test('should fail if user is not authenticated', async ({ graphql }) => {
      const response = await graphql.client.query({ operationName: 'authenticatedUser', query: 'query authenticatedUser { authenticatedUser { username }}' });
      expect(response.body.data.authenticatedUser).eql(null);
      expect(response.body.errors[0].extensions.code).eql('FORBIDDEN');
    });

    test('should return current user', async ({ graphql }) => {
      await graphql.client.login(userData);
      const response = await graphql.client.query({ operationName: 'authenticatedUser', query: 'query authenticatedUser { authenticatedUser { username }}' });
      expect(response.body.data.authenticatedUser.username).eql(userData.username);
    });
  });
});
