import got from 'got';
import { createClient } from 'graphql-ws';
import { serverConfig } from '~playfulbot/serverConfig';
import WebSocket from 'ws';
// import { Client as UrqlClient, ClientOptions, fetchExchange } from '@urql/core';

const wsUrl = `ws://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}/graphql`;
const httpUrl = `http://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}/graphql`;

export class GraphqlTestClient {
  #token: string;
  #fingerprint: string;

  constructor(readonly url: string) {}

  #getHeaders() {
    return {
      Cookie: this.#fingerprint ? `JWTFingerprint=${this.#fingerprint};`: '',
      Authorization: this.#token ? `Bearer ${this.#token}` : '',
    }
  }

  get token() {
    return this.#token;
  }

  get fingerprint() {
    return this.#fingerprint;
  }

  async query(params: { operationName: string, query: string, variables?: object }) {
    const response = await got.post(this.url, {
      json: params,
      headers: this.#getHeaders(),
    });
    return { body: response.body ? JSON.parse(response.body) : undefined, headers: response.headers };
  }

  async login(userData: { username: string, password: string }) {
      const response = await this.query({
          query: `
            mutation login($username: String!, $password: String!) {
              login(username: $username, password: $password) {
                token
              }
            }
          `,
          operationName: "login",
          variables: userData
      });
      if (!response.headers?.['set-cookie']?.[0] || !response.body?.data?.login?.token) {
        throw new Error('Authentication failed');
      }
      const fingerprint = /^JWTFingerprint=([^;]+);/.exec(response.headers['set-cookie'][0])?.[1];
      if (!fingerprint) {
        throw new Error('Missing fingerprint');
      }
      this.#fingerprint = fingerprint;
      this.#token = response.body.data.login.token;
  }
}


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

export function createGraphqlTestWsClient({ url, fingerprint, token }: { url: string, fingerprint: string, token: string }) {
  return createClient({ url, webSocketImpl: AuthWebSocket(fingerprint), connectionParams: { authToken: token } });
}