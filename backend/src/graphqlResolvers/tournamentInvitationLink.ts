import { AuthenticationError, TournamentInvitationNotFound } from '~playfulbot/errors';
import { db } from '~playfulbot/model/db';
import { TournamentInvitationLink } from '~playfulbot/model/TournamentInvitationLink';
import { Tournament } from '~playfulbot/model/Tournaments';
import {
  ApolloContext,
  isUnauthenticatedContext,
  isUserContext,
} from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';

export const tournamentByInvitationLinkResolver: gqlTypes.QueryResolvers<ApolloContext>['tournamentByInvitationLink'] =
  async (parent, args, ctx) => {
    const tournament = await Tournament.getByInvitationLink(
      args.tournamentInvitationLinkID,
      db.default
    );
    if (!tournament) {
      throw new TournamentInvitationNotFound();
    }
    if (isUnauthenticatedContext(ctx)) {
      return {
        id: tournament.id,
        name: tournament.name,
      };
    }
    return tournament;
  };

export const registerTournamentInvitationLinkResolver: gqlTypes.MutationResolvers<ApolloContext>['registerTournamentInvitationLink'] =
  async (parent, args, ctx) => {
    if (!isUserContext(ctx)) {
      throw new AuthenticationError(
        'Only Authenticated users are allowed to rehister a tournament Invitation'
      );
    }

    return db.default.tx(async (tx) => {
      const invitationLink = await TournamentInvitationLink.getByID(
        args.tournamentInvitationLinkID,
        tx
      );
      const invitation = await invitationLink.registerInvitationForUser(ctx.userID, tx);
      return invitation;
    });
  };
