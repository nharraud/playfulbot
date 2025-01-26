import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createGraphqlServer } from '~playfulbot/infrastructure/graphql/graphqlServer';
import http from 'http';
import { serverConfig } from '~playfulbot/serverConfig';
import { createMockContext } from '../../../utils/context';
import { dropTestDB, initTestDB } from '../../../utils/psql';
import { GraphqlTestClient } from './utils/GraphqlTestClient';

const userData = { username: 'testuser', password: 'testpassword' };
let httpUrl: string;// = `http://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}/graphql`;


describe('graphql', () => {
  let client: GraphqlTestClient;
  let server: http.Server;

  beforeEach(async () => {
    await initTestDB();
    const ctx = createMockContext();
    server = await createGraphqlServer(ctx);

    const port = (server.address() as any).port;
    httpUrl = `http://${serverConfig.BACKEND_HOST}:${port}/graphql`;

    await ctx.providers.user.createUser(ctx, userData);
    client = new GraphqlTestClient(httpUrl);
  });

  afterEach(async () => {
    await server?.close();
    await dropTestDB();
  });

  describe('Query/authenticatedUser', () => {
    beforeEach(async () => {
      // hide error logs
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    test('should fail if user is not authenticated', async () => {
      const response = await client.query({ operationName: 'authenticatedUser', query: 'query authenticatedUser { authenticatedUser { username }}' });
      expect(response.body.data.authenticatedUser).eql(null);
      expect(response.body.errors[0].extensions.code).eql('FORBIDDEN');
    });

    test('should return current user', async () => {
      await client.login(userData);
      const response = await client.query({ operationName: 'authenticatedUser', query: 'query authenticatedUser { authenticatedUser { username }}' });
      expect(response.body.data.authenticatedUser.username).eql(userData.username);
    });
  });
});
