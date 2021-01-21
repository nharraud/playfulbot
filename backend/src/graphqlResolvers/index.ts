import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from 'apollo-server-koa';
import { loginResolver, logoutResolver } from '~playfulbot/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~playfulbot/graphqlResolvers/authenticatedUser';
import {
  gamePatchResolver,
  playResolver,
  debugGameResolver,
  createNewDebugGameResolver,
  gameResolver,
} from '~playfulbot/graphqlResolvers/game';

const resolvers: IResolvers = {
  Subscription: {
    gamePatch: gamePatchResolver,
  },
  Query: {
    game: gameResolver,
    debugGame: debugGameResolver,
    authenticatedUser: authenticatedUserResolver,
  },
  Mutation: {
    play: playResolver,
    createNewDebugGame: createNewDebugGameResolver,

    login: loginResolver,
    logout: logoutResolver,
  },
  JSON: GraphQLJSON,
};

export default resolvers;
