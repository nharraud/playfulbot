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
  createNewDebugGameForUserResolver,
} from '~playfulbot/graphqlResolvers/game';
import { GamePatch, isGamePatch, LiveGame } from '~playfulbot/types/backend';
import { GameState } from '~playfulbot/types/gameState';
import { registerUserResolver } from './registration';
import { createTournamentResolver, tournamentResolver } from './tournaments';

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
  LiveGame: {
    __resolveType(obj: LiveGame<GameState>): string {
      if (isGamePatch(obj)) {
        return 'GamePatch';
      }
      return 'Game';
    },
  },
  JSON: GraphQLJSON,
};

export default resolvers;
