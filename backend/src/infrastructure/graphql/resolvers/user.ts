import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
// import { User } from '~playfulbot/core/entities/Users';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
// import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
// import { Tournament } from '~playfulbot/infrastructure/TournamentsProviderPSQL';
import { getUserTeams } from '~playfulbot/core/use-cases/user/getUserTeams';
import { ForbiddenError } from '~playfulbot/core/use-cases/Errors';
import { getUserTournamentInvitations } from '~playfulbot/core/use-cases/user/getUserTournamentInvitations';

export const userTeamsResolver: gqlTypes.UserResolvers<GraphqlContext>['teams'] = async function userTeamsResolver(
  user,
  args,
  apolloContext
) {
  if (!isUserContext(apolloContext)) {
    return [];
  }
  const result = await getUserTeams(apolloContext.ctx, user.id);
  if (result instanceof ForbiddenError) {
    return [];
  }
  return result;
}


export const userTournamentInvitationsResolver: gqlTypes.UserResolvers<GraphqlContext>['tournamentInvitations'] = async function userTournamentInvitationsResolver(
  user,
  args,
  apolloContext
) {
  if (!isUserContext(apolloContext)) {
    return [];
  }
  const result = await getUserTournamentInvitations(apolloContext.ctx, user.id);
  if (result instanceof ForbiddenError) {
    return [];
  }

  return result;
}

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
