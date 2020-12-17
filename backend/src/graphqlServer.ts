import Cookies from 'cookies';

import {
  ApolloServer, gql, AuthenticationError
} from 'apollo-server-koa';

import { validateAuthToken } from '~team_builder/graphqlResolvers/authentication';

import { typeDefs } from '~team_builder/graphqlSchema';
import { resolvers } from '~team_builder/graphqlResolvers';


export const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async (params: any) => {
  
      if (params.connection) {
        // Request from a websocket. It has already been authenticated at connection time.
        return {
          user: params.connection.context.user
        }
      } else {
        // HTTP request
        const koaContext = params.ctx;
  
        const headers = params.ctx?.req.headers;
  
        if (headers.authorization) {
          if (!headers.authorization.startsWith('Bearer '))
            throw new AuthenticationError('Unsupported authorization');
          const token = headers.authorization.split(' ')[1];
          
          const tokenData = await validateAuthToken(token, params.ctx.cookies.get('JWTFingerprint'));
          return {
            koaContext: koaContext,
            user: tokenData.user
          }
        }
        return {
          koaContext: koaContext
        }
      }
    },
    subscriptions: {
      onConnect: async (connectionParams: any, webSocket: any, context: any) => {
        const cookies = new Cookies(context.request, null);
  
        if (!connectionParams.authToken) {
          throw new AuthenticationError('Missing token.');
        }
        const tokenData = await validateAuthToken(connectionParams.authToken, cookies.get('JWTFingerprint'));
        return Promise.resolve({ user: tokenData.user });
      }
    },
  });