import Cookies from 'cookies';

import { ApolloServer, AuthenticationError } from 'apollo-server-koa';

import { ConnectionContext } from 'subscriptions-transport-ws';
import { validateAuthToken } from '~playfulbot/graphqlResolvers/authentication';

import typeDefs from '~playfulbot/graphqlSchema';
import resolvers from '~playfulbot/graphqlResolvers';
import {
  WSConnectionParams,
  WSConnectionContext,
  ContextParams,
  ApolloContext,
} from '~playfulbot/types/apolloTypes';
import { isBotJWToken, isUserJWToken } from './types/token';
import { InvalidRequest } from './errors';

import logger from '~playfulbot/logging';

export default new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    logger.error(err);
    return err;
  },
  context: async (params: ContextParams): Promise<ApolloContext> => {
    // Request from a websocket. It has already been authenticated at connection time.
    if (params.connection) {
      return {
        ...params.connection.context,
      };
    }
    // HTTP request
    const koaContext = params.ctx;

    const headers = params.ctx?.req.headers;

    if (headers.authorization) {
      if (!headers.authorization.startsWith('Bearer '))
        throw new AuthenticationError('Unsupported authorization');
      const token = headers.authorization.split(' ')[1];

      const tokenData = await validateAuthToken(token, params.ctx.cookies.get('JWTFingerprint'));
      if (isUserJWToken(tokenData)) {
        return {
          koaContext,
          userID: tokenData.userID,
        };
      }
      if (isBotJWToken(tokenData)) {
        return {
          koaContext,
          ...tokenData,
        };
      }
      throw new Error('Unknown token type');
    }
    return {
      koaContext,
    };
  },
  subscriptions: {
    onConnect: async (
      connectionParams: WSConnectionParams,
      webSocket: unknown,
      context: ConnectionContext
    ): Promise<WSConnectionContext> => {
      const cookies = new Cookies(context.request, null);

      if (!connectionParams.authToken) {
        throw new AuthenticationError('Missing token.');
      }
      const tokenData = await validateAuthToken(
        connectionParams.authToken,
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
});
