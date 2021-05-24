import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { User } from '~playfulbot/model/User';
import * as gqlTypes from '~playfulbot/types/graphql';
import { db } from '~playfulbot/model/db';
import { Team } from '~playfulbot/model/Team';
import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
import { Tournament } from '~playfulbot/model/Tournaments';

export async function userTeamsResolver(
  parent: User,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Team[]> {
  // FIXME: this should run in the same transaction as the parent query
  return Team.getAll({ memberID: parent.id }, db.default);
}

export function userTournamentInvitationsResolver(
  parent: User,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.TournamentInvitation[]> {
  // FIXME: this should run in the same transaction as the parent query
  // return Tournament.getAll({ invitedUserID: parent.id }, db.default);
  return TournamentInvitation.getAll({ userID: parent.id }, db.default) as any as Promise<
    gqlTypes.TournamentInvitation[]
  >;
}

export function userOrganizedTournamentsResolver(
  parent: User,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Tournament[]> {
  // FIXME: this should run in the same transaction as the parent query
  return Tournament.getAll({ organizingUserID: parent.id }, db.default) as any as Promise<
    gqlTypes.Tournament[]
  >;
}
