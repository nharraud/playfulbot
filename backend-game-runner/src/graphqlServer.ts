import Cookies from 'cookies';
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { readFileSync } from 'fs';
import { join } from 'path';

import { validateAuthToken } from 'playfulbot-backend-commons/lib/graphqlResolvers/authentication.js';
import resolvers from '~game-runner/graphqlResolvers';

import logger from '~game-runner/logging';

import { serverConfig } from './serverConfig';
import { AuthenticationError, InvalidRequest } from './errors';
import { isBotJWToken, isUserJWToken } from 'playfulbot-backend-commons/lib/types/token.js';
import { getDirName } from 'playfulbot-backend-commons/lib/utils/esm.js';

const __dirname = getDirName(import.meta.url);

// const { validateAuthToken } = graphqlResolvers;

interface MyContext {
  token?: string;
}

export async function createGraphqlServer() {
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
        if (!ctx.connectionParams.authToken) {
          throw new AuthenticationError('Missing token.');
        }
        const tokenData = await validateAuthToken(
          ctx.connectionParams.authToken as string,
          cookies.get('JWTFingerprint')
        );
        if (!isUserJWToken(tokenData) && !isBotJWToken(tokenData)) {
          throw new InvalidRequest('Invalid JWToken');
        }
      },
      context: async (ctx, msg, args) => {
        const cookies = new Cookies(ctx.extra.request, null);
        if (!ctx.connectionParams.authToken) {
          throw new AuthenticationError('Missing token.');
        }
        const tokenData = await validateAuthToken(
          ctx.connectionParams.authToken as string,
          cookies.get('JWTFingerprint')
        );
        if (isUserJWToken(tokenData)) {
          return {
            userID: tokenData.userID,
          };
        }
        if (isBotJWToken(tokenData)) {
          return {
            ...tokenData,
          };
        }
        throw new InvalidRequest('Invalid JWToken');
      },
    },
    wsServer
  );

  const server = new ApolloServer<MyContext>({
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
            return Promise.resolve({ userID: tokenData.userID, req });
          }
          if (isBotJWToken(tokenData)) {
            return Promise.resolve({ ...tokenData, req });
          }
          throw new Error('Unknown token type');
        }
        return Promise.resolve({ req });
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: serverConfig.GRAPHQL_PORT }, resolve)
  );
  logger.info(
    `🚀 Server ready at http://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}/graphql`
  );
}
