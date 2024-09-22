import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { User } from '~playfulbot/infrastructure/UserProviderPSQL';
import * as gqlTypes from '~playfulbot/types/graphql';
import { db } from '~playfulbot/model/db';
import { Team } from '~playfulbot/infrastructure/TeamsPSQL';
import { Resolver, ResolversTypes } from '~playfulbot/types/graphql';
import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
import { Tournament } from '~playfulbot/infrastructure/TournamentsProviderPSQL';

export function tournamentInvitationTournamentResolver(
  parent: TournamentInvitation,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Tournament> {
  // FIXME: this should run in the same transaction as the parent query
  return parent.getTournament(db.default);
}

export function tournamentInvitationInviteeResolver(
  parent: TournamentInvitation,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.User> {
  // FIXME: this should run in the same transaction as the parent query
  return parent.getUser(db.default);
}
