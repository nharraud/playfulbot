import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from 'apollo-server-koa';
import { loginResolver, logoutResolver } from '~playfulbot/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~playfulbot/graphqlResolvers/authenticatedUser';
import { teamMembersResolver, teamResolver } from '~playfulbot/graphqlResolvers/team';
import {
  gamePatchResolver,
  playResolver,
  debugGameResolver,
  createNewDebugGameResolver,
  gameResolver,
  gameScheduleResolver,
  gameScheduleChangesResolver,
  createNewDebugGameForUserResolver,
} from '~playfulbot/graphqlResolvers/game';
import { GameState } from '~playfulbot/types/gameState';
import { registerUserResolver } from './registration';
import { createTournamentResolver, tournamentResolver } from './tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';

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
    tournament: tournamentResolver,
  },
  Mutation: {
    play: playResolver,
    createNewDebugGame: createNewDebugGameResolver,
    createNewDebugGameForUser: createNewDebugGameForUserResolver,

    registerUser: registerUserResolver,
    login: loginResolver,
    logout: logoutResolver,
    createTournament: createTournamentResolver,
  },
  Team: {
    members: teamMembersResolver,
  },
  LiveGame: {
    __resolveType(obj: gqlTypes.LiveGame<GameState>): string {
      if (obj.__typename === 'Game') {
        return 'Game';
      }
      return 'GamePatch';
    },
  },
  JSON: GraphQLJSON,
};

export default resolvers;
