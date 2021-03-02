import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from 'apollo-server-koa';
import { loginResolver, logoutResolver } from '~playfulbot/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~playfulbot/graphqlResolvers/authenticatedUser';
import { teamResolver } from '~playfulbot/graphqlResolvers/team';
import {
  gamePatchResolver,
  playResolver,
  debugGameResolver,
  createNewDebugGameResolver,
  gameResolver,
  gameScheduleResolver,
  gameScheduleChangesResolver,
} from '~playfulbot/graphqlResolvers/game';

const resolvers: IResolvers = {
  Subscription: {
    gamePatch: gamePatchResolver,
    gameScheduleChanges: gameScheduleChangesResolver,
  },
  Query: {
    team: teamResolver,
    game: gameResolver,
    debugGame: debugGameResolver,
    gameSchedule: gameScheduleResolver,
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
