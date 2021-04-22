import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from 'apollo-server-koa';
import { loginResolver, logoutResolver } from '~playfulbot/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~playfulbot/graphqlResolvers/authenticatedUser';
import { teamMembersResolver, teamResolver } from '~playfulbot/graphqlResolvers/team';
import { gameResolver, playResolver } from '~playfulbot/graphqlResolvers/game';
import { GameState } from '~playfulbot/types/gameState';
import { registerUserResolver } from './registration';
import { createTournamentResolver, tournamentResolver } from './tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';
import { createNewDebugGameResolver, debugArenaResolver } from './debugArena';
import { playerGamesResolver } from './player';

const resolvers: IResolvers = {
  Subscription: {
    game: gameResolver,
    playerGames: playerGamesResolver,
    debugArena: debugArenaResolver,
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
  JSON: GraphQLJSON,
};

export default resolvers;
