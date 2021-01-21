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
} from '~playfulbot/types/apolloTypes';

export default new ApolloServer({
  typeDefs,
  resolvers,
  context: async (params: ContextParams) => {
    if (params.connection) {
      // Request from a websocket. It has already been authenticated at connection time.
      return {
        user: params.connection.context.user,
        game: params.connection.context?.game,
        playerNumber: params.connection.context?.playerNumber,
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
      return {
        koaContext,
        user: tokenData.user,
        game: tokenData?.game,
        playerNumber: tokenData?.playerNumber,
      };
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
      return Promise.resolve({
        user: tokenData.user,
        game: tokenData?.game,
        playerNumber: tokenData?.playerNumber,
      });
    },
  },
});
