import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from 'apollo-server-koa';
import { loginResolver, logoutResolver } from '~playfulbot/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~playfulbot/graphqlResolvers/authenticatedUser';
import { teamMembersResolver, teamResolver } from '~playfulbot/graphqlResolvers/team';
import { gameResolver, playResolver } from '~playfulbot/graphqlResolvers/game';
import { GameState } from '~playfulbot/types/gameState';
import { registerUserResolver } from './registration';
import {
  createTournamentResolver,
  tournamentResolver,
  tournamentRoundsResolver,
} from './tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';
import { createNewDebugGameResolver, debugArenaResolver } from './debugArena';
import { playerGamesResolver } from './playerGames';
import { DateScalar } from './scalars/DateScalar';
import { teamPlayerResolver } from './teamPlayer';

const resolvers: IResolvers = {
  Subscription: {
    game: gameResolver,
    playerGames: playerGamesResolver,
    debugArena: debugArenaResolver,
    teamPlayer: teamPlayerResolver,
  } as gqlTypes.SubscriptionResolvers,
  Query: {
    team: teamResolver,
    authenticatedUser: authenticatedUserResolver,
    tournament: tournamentResolver,
  } as gqlTypes.QueryResolvers,
  Mutation: {
    play: playResolver,
    createNewDebugGame: createNewDebugGameResolver,
    registerUser: registerUserResolver,
    login: loginResolver,
    logout: logoutResolver,
    createTournament: createTournamentResolver,
  } as gqlTypes.MutationResolvers,
  Team: {
    members: teamMembersResolver,
  },
  Tournament: {
    rounds: tournamentRoundsResolver,
  },
  JSON: GraphQLJSON,
  Date: DateScalar,
};

export default resolvers;
