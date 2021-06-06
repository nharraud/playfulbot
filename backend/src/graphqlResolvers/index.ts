import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from 'apollo-server-koa';
import { loginResolver, logoutResolver } from '~playfulbot/graphqlResolvers/authentication';

import { authenticatedUserResolver } from '~playfulbot/graphqlResolvers/authenticatedUser';
import {
  createTeamResolver,
  joinTeamResolver,
  teamMembersResolver,
  teamResolver,
  teamTournamentResolver,
  updateTeamResolver,
} from '~playfulbot/graphqlResolvers/team';
import { gameResolver, playResolver } from '~playfulbot/graphqlResolvers/game';
import { GameState } from '~playfulbot/types/gameState';
import { registerUserResolver } from './registration';
import {
  createTournamentResolver,
  tournamentInvitationIDResolver,
  tournamentInvitationsResolver,
  tournamentMyRolesResolver,
  tournamentResolver,
  tournamentRoundsResolver,
  tournamentTeamsResolver,
} from './tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';
import { createNewDebugGameResolver, debugArenaResolver } from './debugArena';
import { playerGamesResolver } from './playerGames';
import { DateScalar } from './scalars/DateScalar';
import { teamPlayerResolver } from './teamPlayer';
import { roundResolver, roundTeamGamesResolver, roundTeamPointsResolver } from './rounds';
import { gameSummaryLosersResolver, gameSummaryWinnersResolver } from './gameSummary';
import {
  userOrganizedTournamentsResolver,
  userTeamsResolver,
  userTournamentInvitationsResolver,
} from './user';
import {
  registerTournamentInvitationLinkResolver,
  tournamentByInvitationLinkResolver,
} from './tournamentInvitationLink';
import {
  tournamentInvitationTournamentResolver,
  tournamentInvitationInviteeResolver,
} from './tournamentInvitation';

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
    round: roundResolver,
    tournamentByInvitationLink: tournamentByInvitationLinkResolver,
  } as gqlTypes.QueryResolvers,
  Mutation: {
    play: playResolver,
    createNewDebugGame: createNewDebugGameResolver,
    registerUser: registerUserResolver,
    login: loginResolver,
    logout: logoutResolver,
    createTournament: createTournamentResolver,
    registerTournamentInvitationLink: registerTournamentInvitationLinkResolver,
    joinTeam: joinTeamResolver,
    createTeam: createTeamResolver,
    updateTeam: updateTeamResolver,
  } as gqlTypes.MutationResolvers,
  User: {
    teams: userTeamsResolver,
    tournamentInvitations: userTournamentInvitationsResolver,
    organizedTournaments: userOrganizedTournamentsResolver,
  },
  Team: {
    members: teamMembersResolver,
    tournament: teamTournamentResolver,
  },
  Tournament: {
    rounds: tournamentRoundsResolver,
    invitationLinkID: tournamentInvitationIDResolver,
    myRole: tournamentMyRolesResolver,
    teams: tournamentTeamsResolver,
    invitations: tournamentInvitationsResolver,
  },
  Round: {
    teamPoints: roundTeamPointsResolver,
    teamGames: roundTeamGamesResolver,
  },
  GameSummary: {
    winners: gameSummaryWinnersResolver,
    losers: gameSummaryLosersResolver,
  },
  TournamentInvitation: {
    tournament: tournamentInvitationTournamentResolver,
    invitee: tournamentInvitationInviteeResolver,
  },
  JSON: GraphQLJSON,
  Date: DateScalar,
};

export default resolvers;
