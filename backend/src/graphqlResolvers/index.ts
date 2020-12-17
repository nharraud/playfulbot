import GraphQLJSON from 'graphql-type-json';

import {
  loginResolver, logoutResolver
} from '~team_builder/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~team_builder/graphqlResolvers/authenticatedUser';
import { gamePatchResolver, playResolver, gameResolver } from '~team_builder/graphqlResolvers/game';


export const resolvers = {
    Subscription: {
      gamePatch: gamePatchResolver,
    },
    Query: {
      game: gameResolver,
      authenticatedUser: authenticatedUserResolver
    },
    Mutation: {
      play: playResolver,
  
      login: loginResolver,
      logout: logoutResolver
    },
    JSON: GraphQLJSON,
  };