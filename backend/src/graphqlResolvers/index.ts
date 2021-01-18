import GraphQLJSON from 'graphql-type-json';

import { loginResolver, logoutResolver } from '~playfulbot/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~playfulbot/graphqlResolvers/authenticatedUser';
import {
  gamePatchResolver,
  playResolver,
  debugGameResolver,
  createNewDebugGameResolver,
  gameResolver,
} from '~playfulbot/graphqlResolvers/game';

export const resolvers = {
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
