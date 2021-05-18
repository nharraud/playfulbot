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

export const tournamentByInvitationResolver: gqlTypes.QueryResolvers<ApolloContext>['tournamentByInvitation'] =
  async (parent, args, ctx) => {
    const tournament = await Tournament.getByInvitationLink(
      args.tournamentInvitationID,
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

export const registerTournamentInvitationResolver: gqlTypes.MutationResolvers<ApolloContext>['registerTournamentInvitation'] =
  async (parent, args, ctx) => {
    if (!isUserContext(ctx)) {
      throw new AuthenticationError(
        'Only Authenticated users are allowed to rehister a tournament Invitation'
      );
    }

    return db.default.tx(async (tx) => {
      const invitationLink = await TournamentInvitationLink.getByID(
        args.tournamentInvitationID,
        tx
      );
      const invitation = await invitationLink.registerInvitationForUser(ctx.userID, tx);
      return invitation;
    });
  };
