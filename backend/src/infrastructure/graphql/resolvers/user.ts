import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
// import { User } from '~playfulbot/core/entities/Users';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
// import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
// import { Tournament } from '~playfulbot/infrastructure/TournamentsProviderPSQL';
import { getUserTeams } from '~playfulbot/core/use-cases/user/getUserTeams';
import { ForbiddenError } from '~playfulbot/core/use-cases/Errors';

export const userTeamsResolver: gqlTypes.UserResolvers<GraphqlContext>['teams'] = async function userTeamsResolver(
  parent,
  args,
  apolloContext
) {
  if (!isUserContext(apolloContext)) {
    return [];
  }
  const result = await getUserTeams(apolloContext.ctx, parent.id);
  if (result instanceof ForbiddenError) {
    return [];
  }
  return result;
}

// export function userTournamentInvitationsResolver(
//   parent: User,
//   args: undefined,
//   context: GraphqlContext
// ): Promise<gqlTypes.TournamentInvitation[]> {
//   // FIXME: this should run in the same transaction as the parent query
//   // return Tournament.getAll({ invitedUserID: parent.id }, db.default);
//   return TournamentInvitation.getAll({ userID: parent.id }, db.default) as any as Promise<
//     gqlTypes.TournamentInvitation[]
//   >;
// }

// export function userOrganizedTournamentsResolver(
//   parent: User,
//   args: undefined,
//   context: GraphqlContext
// ): Promise<gqlTypes.Tournament[]> {
//   // FIXME: this should run in the same transaction as the parent query
//   return Tournament.getAll({ organizingUserID: parent.id }, db.default) as any as Promise<
//     gqlTypes.Tournament[]
//   >;
// }
