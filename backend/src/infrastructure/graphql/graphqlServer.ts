import Cookies from 'cookies';
import express from 'express';
import http from 'http';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { readFileSync } from 'fs';
import { join } from 'path';

import resolvers from '~playfulbot/infrastructure/graphql/resolvers';

import { serverConfig } from '../../serverConfig';
import { AuthenticationError, InvalidRequest } from '../../errors';
// import { validateAuthToken } from './resolvers/authentication';
// import { isBotJWToken, isUserJWToken } from '../../types/token';
import { validateAuthToken } from 'playfulbot-backend-commons/lib/graphqlResolvers/authentication.js';
import { isBotJWToken, isUserJWToken } from 'playfulbot-backend-commons/lib/types/token.js';
import { Context } from '../../core/use-cases/interfaces/Context';
import { ApolloContext } from './types/apolloTypes';
import { DeferredPromise } from '~playfulbot/utils/DeferredPromise';
import { UnkownError } from '~playfulbot/core/use-cases/Errors';

class CancelTransactionError extends Error {
  constructor() {
    super('This error is used to cancel the GraphQL transaction after an error happened');
  }
}

/**
 * @returns Apollo server plugin which creates a new transaction for each request and stops it when the request ends
 */
function ApolloTransactionPlugin (): ApolloServerPlugin<ApolloContext> {
  return {
    async requestDidStart() {
      const requestPromise = new DeferredPromise<void>;
      const txPromise = new DeferredPromise<void>;
      return {
        async executionDidStart({ contextValue: { ctx } }) {
          const { contextReady, transactionPromise } = await ctx.txPromise(requestPromise.promise);

          transactionPromise.then(() => txPromise.resolve())
            .catch((err) => {
              if (err instanceof CancelTransactionError) {
                txPromise.resolve();
              } else {
                txPromise.reject(new UnkownError('Transaction failed', err))
              }
            });

          await contextReady;

          return {
            async executionDidEnd(err) {
              // if `err` is set, `requestPromise` is already rejected by `didEncounterErrors` and it also awaits `txPromise`
              if (!err) {
                requestPromise.resolve();
                await txPromise.promise;
              }
            }
          }
        },
        async didEncounterErrors() {
          requestPromise.reject(new CancelTransactionError());
          await txPromise.promise;
        }
      }
    },
  };
};

export async function createGraphqlServer<CTX extends Context<any>>(baseContext: CTX, { port, host }: { port?: number, host?: string } = {}) {
  const logger = baseContext.logger.child({ module: __filename, source: 'createGraphqlServer' });
  const app = express();
  const httpServer = http.createServer(app);

  // we must convert the file Buffer to a UTF-8 string
  const typeDefs = readFileSync(join(__dirname, 'graphqlSchema.graphql')).toString('utf-8');
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        const cookies = new Cookies(ctx.extra.request, null);
        if (!ctx.connectionParams?.authToken) {
          throw new AuthenticationError('Missing token.');
        }

        let tokenData;
        try {
          tokenData = await validateAuthToken(
            ctx.connectionParams.authToken as string,
            cookies.get('JWTFingerprint')
          );
        } catch (err) {
          baseContext.logger.error('Token validation failed', err);
          throw new InvalidRequest((err as any)?.message);
        }

        if (!isUserJWToken(tokenData) && !isBotJWToken(tokenData)) {
          throw new InvalidRequest('Invalid JWToken');
        }
      },
      context: async (ctx, msg, args) => {
        const cookies = new Cookies(ctx.extra.request, null);
        if (!ctx.connectionParams?.authToken) {
          throw new AuthenticationError('Missing token.');
        }
        const tokenData = await validateAuthToken(
          ctx.connectionParams.authToken as string,
          cookies.get('JWTFingerprint')
        );
        if (isUserJWToken(tokenData)) {
          return {
            ctx: baseContext.ctxWithChildLogger({ source: 'grapqhl' }),
            userID: tokenData.userID,
          };
        }
        if (isBotJWToken(tokenData)) {
          return {
            ctx: baseContext.ctxWithChildLogger({ source: 'grapqhl' }),
            ...tokenData,
          };
        }
        throw new InvalidRequest('Invalid JWToken');
      },
    },
    wsServer
  );

  const server = new ApolloServer<ApolloContext>({
    schema,
    plugins: [
      // Tell Apollo Server to "drain" this httpServer,
      // enabling our servers to shut down gracefully.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        serverWillStart() {
          return Promise.resolve({
            async drainServer() {
              await serverCleanup.dispose();
            },
          });
        },
      },
      ApolloTransactionPlugin(),
    ],
  });
  // Ensure we wait for our server to start
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        if (req.headers.authorization) {
          if (!req.headers.authorization.startsWith('Bearer '))
            throw new AuthenticationError('Unsupported authorization');
          const token = req.headers.authorization.split(' ')[1];

          const cookies = new Cookies(req, null);
          const tokenData = await validateAuthToken(token, cookies.get('JWTFingerprint'));
          if (isUserJWToken(tokenData)) {
            return Promise.resolve({
              ctx: baseContext.ctxWithChildLogger({ source: 'grapqhl' }),
              userID: tokenData.userID,
              req
            });
          }
          if (isBotJWToken(tokenData)) {
            return Promise.resolve({
              ctx: baseContext.ctxWithChildLogger({ source: 'grapqhl' }),
              ...tokenData,
              req
            });
          }
          throw new Error('Unknown token type');
        }
        return Promise.resolve({ req, ctx: baseContext.ctxWithChildLogger({ source: 'grapqhl' }) });
      },
    })
  );

  const serverPort = port || serverConfig.GRAPHQL_PORT;
  const serverHost = host || serverConfig.BACKEND_HOST;
  return new Promise<{ server: http.Server, httpUrl: string, wsUrl: string }>((resolve) =>
    httpServer.listen({ port: serverPort }, () => {
      logger.info(
        `🚀 Server ready at http://${serverHost}:${serverPort}/graphql`
      );
      const finalPort = (httpServer.address() as any).port;
      resolve({
        server: httpServer,
        httpUrl:`http://${serverHost}:${finalPort}/graphql`,
        wsUrl: `ws://${serverHost}:${finalPort}/graphql`,
      });
  }));
}
