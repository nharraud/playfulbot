import { afterEach, beforeEach, beforeAll, describe, expect, test, vi, afterAll } from 'vitest';
import { createGraphqlServer } from '~playfulbot/infrastructure/graphql/graphqlServer';
import http from 'http';
import { Client } from 'graphql-ws';
import got, { HTTPError } from 'got';

import { dropTestDB, initTestDB } from '../../../utils/psql';
import { createMockContext } from '../../../utils/context';
import { IResolvers } from '@graphql-tools/utils';
import { ApolloContext } from '~playfulbot/infrastructure/graphql/types/apolloTypes';
import { User } from '~playfulbot/core/entities/Users';
import { createGraphqlTestWsClient, GraphqlTestClient } from './utils/GraphqlTestClient';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';
import { default as defaultResolvers } from '~playfulbot/infrastructure/graphql/resolvers';

const typeDefs = `
  type MyFailure {
    message: String
  }
  type MyError {
    message: String
  }
  type MySuccess {
    message: String
  }
  union actResult = MySuccess | MyError | MyFailure
  type Query {
    foo: Boolean
  }
  type Mutation {
    act: actResult
  }
`;

describe('graphql/graphqlServer', () => {
  let server: http.Server;
  let httpUrl: string;
  let ctx: ContextPSQL;

  beforeEach(async () => {
    await initTestDB();
    ctx = createMockContext();
  });

  afterEach(async () => {
    // client?.terminate();
    await server?.close();
    await dropTestDB();
    vi.restoreAllMocks();
  });

  describe('HTTP requests', () => {
    const query = `
      mutation act {
        act {
          ... on MyError {
            __typename
            message
          }
          ... on MyFailure {
            __typename
            message
          }
          ... on MySuccess {
            __typename
            message
          }
        }
      }
    `;
    afterEach(() => {
      vi.restoreAllMocks();
    });
    async function run() {
      try {
        const result = await got.post(httpUrl, {
          json: {
            query,
            operationName: "act"
          }
        });
        return { result };
      } catch (err) {
        return { err };
      }
    }
  
    test('should rollback transaction if an exception is thrown', async () => {
      let user: User;
      const resolvers: IResolvers = {
        Query: {},
        Mutation: {
          act: async (parent: unknown, args: any, apolloContext: ApolloContext) => {
            user = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: 'abc', password: 'b' }) as User;
            throw new Error('expected error');
          }
        }
      };
      ({ server, httpUrl} = await createGraphqlServer(ctx, { typeDefs, resolvers }));
      const response = await run();
      const body = JSON.parse(response.result.body);
      expect(body.errors).toHaveLength(1);
      expect(body.errors[0]).toMatchObject({
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
        message: 'Unexpected error.',
      });
      const retrievedUser = await ctx.providers.user.getUserByID(ctx, user?.id);
      expect(retrievedUser).toBeNull();
    });
  
    test('should rollback transaction if an Error is returned', async () => {
      let user: User;
      const resolvers: IResolvers = {
        Query: {},
        Mutation: {
          act: async (parent: unknown, args: any, apolloContext: ApolloContext) => {
            user = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: 'abc', password: 'b' }) as User;
            return {
              __typename: 'MyError',
              message: 'expected error'
            }
          }
        }
      };
      ({ server, httpUrl} = await createGraphqlServer(ctx, { typeDefs, resolvers }));
      const response = await run();
      const body = JSON.parse(response.result.body);
      expect(body.data).toMatchObject({
        act:{
          __typename: 'MyError',
          message: 'expected error'
        }
      });
      const retrievedUser = await ctx.providers.user.getUserByID(ctx, user?.id);
      expect(retrievedUser).toBeNull();
    });
    
    test('should rollback transaction if a Failure is returned', async () => {
      let user: User;
      const resolvers: IResolvers = {
        Query: {},
        Mutation: {
          act: async (parent: unknown, args: any, apolloContext: ApolloContext) => {
            user = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: 'abc', password: 'b' }) as User;
            return {
              __typename: 'MyFailure',
              message: 'expected error'
            }
          }
        }
      };
      ({ server, httpUrl} = await createGraphqlServer(ctx, { typeDefs, resolvers }));
      const response = await run();
      const body = JSON.parse(response.result.body);
      expect(body.data).toMatchObject({
        act:{
          __typename: 'MyFailure',
          message: 'expected error'
        }
      });
      const retrievedUser = await ctx.providers.user.getUserByID(ctx, user?.id);
      expect(retrievedUser).toBeNull();
    });
  
    test('should succeed the transaction if a no failure or error is returned', async () => {
      let user: User;
      const resolvers: IResolvers = {
        Query: {},
        Mutation: {
          act: async (parent: unknown, args: any, apolloContext: ApolloContext) => {
            user = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: 'abc', password: 'b' }) as User;
            return {
              __typename: 'MySuccess',
              message: 'this is a success'
            }
          }
        }
      };
      ({ server, httpUrl} = await createGraphqlServer(ctx, { typeDefs, resolvers }));
      const response = await run();
      const body = JSON.parse(response.result.body);
      expect(body.data).toMatchObject({
        act: {
          __typename: 'MySuccess',
          message: 'this is a success'
        }
      });
      const retrievedUser = await ctx.providers.user.getUserByID(ctx, user?.id);
      expect(retrievedUser).not.toBeNull();
    });
  
    test('should not start transaction when request has a syntax error', async () => {
      const transactionSpy = vi.spyOn(ctx, 'txIf');
      ({ server, httpUrl} = await createGraphqlServer(ctx));
      const response = await got.post(httpUrl, {
        json: {
          query: 'mutation act { act }',
          operationName: "act"
        }
      });
      const body = JSON.parse(response.body);
      expect(body.errors).toHaveLength(1);
      expect(body.errors[0]).toMatchObject({
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
        }
      });
      expect(transactionSpy).not.toHaveBeenCalled();
    });
  });

  describe('Websocket requests', () => {
    const query = `
      mutation updateTeam($teamID: ID!, $input: TeamInput!) {
        updateTeam(teamID: $teamID, input: $input) {
          ... on UpdateTeamSuccess {
            team {
              id
            }
          }
          ... on UpdateTeamFailure {
            __typename
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      }
    `;
    let wsClient: Client;
    const userData = { username: 'testuser', password: 'testpassword' };

    afterEach(async () => {
      wsClient?.terminate();
    });

    test('websocket should rollback only the transaction of the failing request', async () => {
      let isFirst = true;
      let user1, user2: User;
      const resolvers: IResolvers = { ...defaultResolvers };
      resolvers.Mutation.updateTeam = async (parent: unknown, args: any, apolloContext: ApolloContext) => {
        if (isFirst) {
          isFirst = false;
          user1 = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: 'abc', password: 'b' }) as User;
          return {
            __typename: 'UpdateTeamSuccess',
            team: { id: 'myteam' }
          }
        } else {
          user2 = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: 'def', password: 'b' }) as User;
          throw new Error('expected error');
        }
      };
      let wsUrl: string;
      ({ server, wsUrl, httpUrl} = await createGraphqlServer(ctx, { resolvers }));

      await ctx.providers.user.createUser(ctx, userData);
      const httpClient = new GraphqlTestClient(httpUrl);
      await httpClient.login(userData);
      wsClient = createGraphqlTestWsClient({ url: wsUrl, fingerprint: httpClient.fingerprint, token: httpClient.token });

      // const query = 'query authenticatedUser { authenticatedUser { username }}';
      const results1 = wsClient.iterate({ query, variables: { teamID: 'foo', input: { name: 'bar' }} });
      const result1 = await results1.next();
      expect(result1.value.data.updateTeam.team.id).toEqual('myteam');
      // Check that the transaction succeeded
      const retrievedUser1 = await ctx.providers.user.getUserByID(ctx, user1.id);
      expect(retrievedUser1).not.toBeNull();

      const results2 = wsClient.iterate({ query, variables: { teamID: 'foo', input: { name: 'bar' }} });
      const result2 = await results2.next();
      expect(result2.value.errors[0].message).toEqual('Unexpected error.');
      // Check that the transaction failed
      const retrievedUser2 = await ctx.providers.user.getUserByID(ctx, user2.id);
      expect(retrievedUser2).toBeNull();
    });

    test('websocket should rollback the transation when a Failure is returned', async () => {
      let user: User;
      const resolvers: IResolvers = { ...defaultResolvers };
      resolvers.Mutation.updateTeam = async (parent: unknown, args: any, apolloContext: ApolloContext) => {
        user = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: 'abc', password: 'b' }) as User;
        return {
          __typename: 'UpdateTeamFailure',
          errors: [{ __typename: 'ValidationError', message: 'expected error' }]
        }
      };
      let wsUrl: string;
      ({ server, wsUrl, httpUrl} = await createGraphqlServer(ctx, { resolvers }));

      await ctx.providers.user.createUser(ctx, userData);
      const httpClient = new GraphqlTestClient(httpUrl);
      await httpClient.login(userData);
      wsClient = createGraphqlTestWsClient({ url: wsUrl, fingerprint: httpClient.fingerprint, token: httpClient.token });

      const results = wsClient.iterate({ query, variables: { teamID: 'foo', input: { name: 'bar' }} });
      const result = await results.next();
      expect(result.value.data).toMatchObject({
        updateTeam:{
          __typename: 'UpdateTeamFailure',
          errors: [{ message: 'expected error' }]
        }
      });
      // Check that the transaction failed
      const retrievedUser = await ctx.providers.user.getUserByID(ctx, user.id);
      expect(retrievedUser).toBeNull();
    });
  });
});
