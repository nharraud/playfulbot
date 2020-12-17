import koa from 'koa';
import cors from '@koa/cors';

import Cookies from 'cookies';

import {
  ApolloServer, gql, PubSub, AuthenticationError
} from 'apollo-server-koa';

import GraphQLJSON from 'graphql-type-json';

import * as jsonpatch from "fast-json-patch";

import { init, actions } from "~team_builder/games/tictactoe";

import { UnknownAction } from "./Errors";

import {
  validateAuthToken, loginResolver, logoutResolver
} from '~team_builder/resolvers/authentication';

import { authenticatedUserResolver } from '~team_builder/resolvers/authenticatedUser';


const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar JSON

  type User {
    id: ID,
    username: String
  }

  type LoginResult {
    user: User,
    token: String
  }

  type Mutation {
    play(action: String!, data: JSON!): JSON
    login(username: String!, password: String!): LoginResult
    logout: Boolean
  }

  type Subscription {
    gamePatch: JSON
  }

  type Query {
    game: JSON
    authenticatedUser: User
  }
`;

const gameState = init();

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';

const resolvers = {
  Subscription: {
    gamePatch: {
    subscribe: () => pubsub.asyncIterator([GAME_STATE_CHANGED]),
    },
  },
  Query: {
    game: () => gameState,
    authenticatedUser: authenticatedUserResolver
  },
  Mutation: {
    play: (parent: any, args: any, context: any, info: any) => {
      console.log("playing " + args.action)
      console.log(JSON.stringify(args.data))
      const gameAction = actions.get(args.action);
      if (!gameAction) {
        throw new UnknownAction(args.action);
      }
      const observer = jsonpatch.observe<object>(gameState);
      gameAction.handler(0, gameState, args.data);
      const patch = jsonpatch.generate(observer);
      jsonpatch.unobserve(gameState, observer);
      pubsub.publish(GAME_STATE_CHANGED, {
        gamePatch: patch
      });
    },

    login: loginResolver,
    logout: logoutResolver
  },
  JSON: GraphQLJSON,
};

const server = new ApolloServer({
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

const app = new koa();

app.use(cors({origin: 'http://localhost:3000', credentials: true}));

server.applyMiddleware({ app });

const httpServer = app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

server.installSubscriptionHandlers(httpServer);
