import got from 'got';
import { serverConfig } from '~playfulbot/serverConfig';
// import { Client as UrqlClient, ClientOptions, fetchExchange } from '@urql/core';

const wsUrl = `ws://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}/graphql`;
const httpUrl = `http://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}/graphql`;

// function login(variables: { username: string, password: string }) {
//   return got.post(httpUrl, {
//     json: {
//       query: `
//         mutation login($username: String!, $password: String!) {
//           login(username: $username, password: $password) {
//             user { username }
//             token
//           }
//         }
//       `,
//       operationName: "login",
//       variables
//     }
//   });
// }

export class GraphqlTestClient {
  #token: string;
  #fingerprint: string;

  constructor(readonly url: string) {
    //   fetchOptions: () => {
    //     return {
    //       headers: {
    //         authorization: this.#token ? `Bearer ${this.#token}` : '',
    //         Cookie: this.#fingerprint ? `JWTFingerprint=${this.#fingerprint};` : ''
    //       },
    //     };
    //   },
    // });
  }

  #getHeaders() {
    return {
      Cookie: this.#fingerprint ? `JWTFingerprint=${this.#fingerprint};`: '',
      Authorization: this.#token ? `Bearer ${this.#token}` : '',
    }
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