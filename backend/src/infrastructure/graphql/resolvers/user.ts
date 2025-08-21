import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
// import { User } from '~playfulbot/core/entities/Users';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
// import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
// import { Tournament } from '~playfulbot/infrastructure/TournamentsProviderPSQL';
import { getUserTeams } from '~playfulbot/core/use-cases/user/getUserTeams';
import { ForbiddenError } from '~playfulbot/core/use-cases/Errors';
import { getUserTournamentInvitations } from '~playfulbot/core/use-cases/user/getUserTournamentInvitations';
import { getUserOrganizedTournaments } from '~playfulbot/core/use-cases/user/getUserOrganizedTournaments';

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



export const userOrganizedTournamentsResolver: gqlTypes.UserResolvers<GraphqlContext>['organizedTournaments'] = async function userOrganizedTournamentsResolver(
  user,
  args,
  apolloContext
) {
  if (!isUserContext(apolloContext)) {
    return [];
  }
  // FIXME: this should run in the same transaction as the parent query
  const result = await getUserOrganizedTournaments(apolloContext.ctx, user.id);
  if (result instanceof ForbiddenError) {
    return [];
  }
  return result;
}
