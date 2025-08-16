import { GraphqlContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { isTournamentInvitation } from '~playfulbot/core/entities/TournamentInvitation';


export const tournamentInvitationTournamentResolver: gqlTypes.TournamentInvitationResolvers<GraphqlContext>['tournament'] = async function userTournamentInvitationsResolver(
  tournamentInvitation,
  args,
  apolloContext
) {
  if (isTournamentInvitation(tournamentInvitation)) {
    return apolloContext.ctx.providers.tournament.getTournamentByID(apolloContext.ctx, tournamentInvitation.tournamentId);
  }
}

export const tournamentInvitationInviteeResolver: gqlTypes.TournamentInvitationResolvers<GraphqlContext>['invitee'] = async function userTournamentInvitationsResolver(
  tournamentInvitation,
  args,
  apolloContext
) {
  if (isTournamentInvitation(tournamentInvitation)) {
    return apolloContext.ctx.providers.user.getUserByID(apolloContext.ctx, tournamentInvitation.inviteeId);
  }
}
