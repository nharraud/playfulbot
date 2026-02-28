import { afterEach, beforeEach, beforeAll, describe, expect, test, vi, afterAll } from 'vitest';
import { createGraphqlServer } from '~playfulbot/infrastructure/graphql/graphqlServer';
import http from 'http';
import { Client, createClient } from 'graphql-ws';
import got from 'got';
import WebSocket from 'ws';
import { createMockContext } from '../../../utils/context';
import { dropTestDB, initTestDB } from '../../../utils/psql';
import { hideErrorLogs } from './utils/logger';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';

describe('graphql', () => {
  let client: Client;
  let server: http.Server;
  let wsUrl: string;
  let httpUrl: string;
  let ctx: ContextPSQL;
  const userData = { username: 'testuser', password: 'testpassword' };

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    await initTestDB();
    ctx = await createMockContext();
    ({ server, wsUrl, httpUrl} = await createGraphqlServer(ctx));
    await ctx.providers.user.createUser(ctx, userData);
  });

  function createTestWsClient(params: any) {
    client = createClient({ url: wsUrl, webSocketImpl: WebSocket, ...params });
    return client;
  }

  afterEach(async () => {
    client?.terminate();
    await server?.close();
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('Websocket server errors', () => {
    beforeEach(() => {
      hideErrorLogs();
    });

    test('should fail if no connectionParams are provided', async () => {
      createTestWsClient({})
      const query = client.iterate({ query: '' });
      let error: { reason?: string };
      try { await query.next() } catch(err) { error = err; }
      expect(error?.reason).toEqual('Missing token.');
    });
  
    test('should fail if no auth token is provided', async () => {
      createTestWsClient({ connectionParams: {}})
      const query = client.iterate({ query: '' });
      let error: { reason?: string };
      try { await query.next() } catch(err) { error = err; }
      expect(error?.reason).toEqual('Missing token.');
    });
  
    test('should fail if the provided authToken is invalid', async () => {
      createTestWsClient({ connectionParams: { authToken: 'anInvalidToken' }})
      const query = client.iterate({ query: '' });
      let error: { reason?: string };
      try { await query.next() } catch(err) { error = err; }
      expect(error?.reason).toEqual('Invalid authorization token: token validation failed.');
    });
  
    // test('should fail when the provided game ID does not exist', async () => {
    //   const authToken = jwt.sign({ playerID: 'myPlayer' },SECRET_KEY);
    //   createTestClient({ connectionParams: { authToken }})
    //   const query = client.iterate({
    //     query: 'subscription { game(gameID: "42") { ... on Game { id } } }',
    //   });
    //   const message = await query.next();
    //   expect(message.value.errors[0]?.message).toEqual('Game not found');
    // });
  });


  describe('Mutation/registerUser', () => {
    function register(variables: { username: string, password: string }) {
      return got.post(httpUrl, {
        json: {
          query: `
            mutation registerUser($username: String!, $password: String!) {
              registerUser(username: $username, password: $password) {
                ... on LoginSuccess {
                  __typename
                  user { username }
                  token
                }
                ... on Error {
                  __typename
                }
              }
            }
          `,
          operationName: "registerUser",
          variables
        }
      });
    }

    test('should return the user and token on successful registration', async () => {
      const newUserData = { username: 'newuser', password: 'newpassword' };
      const response = await register(newUserData);
      const body = JSON.parse(response.body);
      expect(body.data).toMatchObject({
        registerUser: {
          token: expect.any(String),
          user: { username: newUserData.username }
        }
      });
      expect(response.headers).toHaveProperty('set-cookie');
      expect(response.headers['set-cookie'][0]).match(/^JWTFingerprint=[^;]/);
    });

    test('should fail registration if another user has the same name', async () => {
      const response = await register(userData);
      const body = JSON.parse(response.body);
      expect(body.data).toMatchObject({ registerUser: { __typename: 'UsernameAlreadyTaken' } });
      expect(response.headers).not.toHaveProperty('set-cookie');
    });

    test('should fail registration if username is invalid (too short)', async () => {
      const response = await register({ username: 't', password: '1234' });
      const body = JSON.parse(response.body);
      expect(body.data).toMatchObject({ registerUser: { __typename: 'ValidationError' } });
      expect(response.headers).not.toHaveProperty('set-cookie');
    });
  });

  function login(variables: { username: string, password: string }) {
    return got.post(httpUrl, {
      json: {
        query: `
          mutation login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              user { username }
              token
            }
          }
        `,
        operationName: "login",
        variables
      }
    });
  }

  describe('Mutation/login', () => {
    test('should return the user and token on successful login', async () => {
      const response = await login(userData);
      const body = JSON.parse(response.body);
      expect(body.data).toMatchObject({
        login: {
          token: expect.any(String),
          user: { username: userData.username }
        }
      });
      expect(response.headers).toHaveProperty('set-cookie');
      expect(response.headers['set-cookie'][0]).match(/^JWTFingerprint=[^;]/);
    });

    test('should return an error when the user does not exist', async () => {
      hideErrorLogs();
      const variables = { username: 'unknown', password: 'pass' };
      const response = await login(variables);
      const body = JSON.parse(response.body);
      expect(body.errors).toHaveLength(1);
      expect(body.errors[0]).toMatchObject({
        extensions: {
          code: 'UNAUTHENTICATED',
        },
        message: 'Could not find account: unknown',
      });
      expect(response.headers).not.toHaveProperty('set-cookie');
    });

    test('should fail when the password is invalid', async () => {
      hideErrorLogs();
      const variables = { username: userData.username, password: 'wrong password' };
      const response = await login(variables);
      const body = JSON.parse(response.body);
      expect(body.errors).toHaveLength(1);
      expect(body.errors[0]).toMatchObject({
        extensions: {
          code: 'UNAUTHENTICATED',
        },
        message: 'Incorrect credentials',
      });
      expect(response.headers).not.toHaveProperty('set-cookie');
    });
  });

  describe('Mutation/logout', () => {
    test('should logout', async () => {
      const response = await got.post(httpUrl, {
        json: {
          query: 'mutation logout { logout }',
          operationName: "logout",
        }
      });
      const body = JSON.parse(response.body);
      expect(body.data).toMatchObject({
        logout: true
      });
      expect(response.headers).toHaveProperty('set-cookie');
      expect(response.headers['set-cookie'][0]).match(/^JWTFingerprint=;/);
    });
  });

  describe('Websocket server authentication', () => {
    function AuthWebSocket(fingerprint: string) {
      return class AuthWebSocket extends WebSocket {
        constructor(address: any, protocols: any) {
          super(address, protocols, {
            headers: {
              Cookie: `JWTFingerprint=${fingerprint};`
            },
          });
        }
      }
    }

    test('should be able to query using credentials returned by login', async () => {
      const loginResponse = await login(userData);
      const body = JSON.parse(loginResponse.body);
      const fingerprint = /JWTFingerprint=([^;]+);/.exec(loginResponse.headers['set-cookie'][0])[1];
      const token = body.data.login.token;

      client = createClient({ url: wsUrl, webSocketImpl: AuthWebSocket(fingerprint), connectionParams: { authToken: token } });
      const query = client.iterate({ query: 'query authenticatedUser { authenticatedUser { username }}' });
      const authenticatedUser = await query.next();
      expect(authenticatedUser.value.data.authenticatedUser.username).toEqual(userData.username);
    });

    test('should fail if the token is missing', async () => {
      hideErrorLogs();
      const loginResponse = await login(userData);
      const body = JSON.parse(loginResponse.body);
      const fingerprint = /JWTFingerprint=([^;]+);/.exec(loginResponse.headers['set-cookie'][0])[1];
      const token = body.data.login.token;

      client = createClient({ url: wsUrl, webSocketImpl: AuthWebSocket(fingerprint) });
      const query = client.iterate({ query: 'query authenticatedUser { authenticatedUser { username }}' });
      let error: CloseEvent;
      try {
        await query.next();
      } catch (err) {
        error = err as CloseEvent;
      }
      expect(error?.reason).toEqual("Missing token.")
    });

    test('should fail if the fingerprint is incorrect', async () => {
      hideErrorLogs();
      const loginResponse = await login(userData);
      const body = JSON.parse(loginResponse.body);
      const token = body.data.login.token;
      client = createClient({ url: wsUrl, webSocketImpl: AuthWebSocket('invalid'), connectionParams: { authToken: token } });
      const query = client.iterate({ query: 'query authenticatedUser { authenticatedUser { username }}' });
      let error: CloseEvent;
      try {
        await query.next();
      } catch (err) {
        error = err as CloseEvent;
      }
      expect(error?.reason).toEqual("Invalid authorization token: fingerprint doesn't match")
    });

    test('should fail if the fingerprint is missing', async () => {
      hideErrorLogs();
      const loginResponse = await login(userData);
      const body = JSON.parse(loginResponse.body);
      const token = body.data.login.token;
      client = createClient({ url: wsUrl, webSocketImpl: WebSocket, connectionParams: { authToken: token } });
      const query = client.iterate({ query: 'query authenticatedUser { authenticatedUser { username }}' });
      let error: CloseEvent;
      try {
        await query.next();
      } catch (err) {
        error = err as CloseEvent;
      }
      expect(error?.reason).toEqual("Invalid authorization token: missing fingerprint.")
    });
  });
});
