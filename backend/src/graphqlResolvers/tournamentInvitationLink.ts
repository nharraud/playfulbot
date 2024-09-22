import { AuthenticationError, TournamentInvitationNotFound } from '~playfulbot/errors';
import { db } from '~playfulbot/model/db';
import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
import { TournamentInvitationLink } from '~playfulbot/model/TournamentInvitationLink';
import { Tournament } from '~playfulbot/infrastructure/TournamentsProviderPSQL';
import {
  ApolloContext,
  isUnauthenticatedContext,
  isUserContext,
} from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';
import { RegisterTournamentInvitationResult } from '~playfulbot/types/graphql';

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
        'Only Authenticated users are allowed to register a tournament Invitation'
      );
    }

    return db.default.tx<RegisterTournamentInvitationResult>(async (tx) => {
      const invitationLink = await TournamentInvitationLink.getByID(
        args.tournamentInvitationLinkID,
        tx
      );
      if (!invitationLink) {
        return {
          __typename: 'RegisterTournamentInvitationFailure',
          errors: [
            {
              __typename: 'TournamentInvitationLinkNotFoundError',
              message: 'This link is not valid.',
            },
          ],
        };
      }
      const result = await invitationLink.registerInvitationForUser(ctx.userID, tx);
      if (result.inATeam === true) {
        return {
          __typename: 'RegisterTournamentInvitationFailure',
          errors: [
            {
              __typename: 'AlreadyInATeamError',
              message: 'User already joined a team.',
            },
          ],
        };
      }
      return {
        __typename: 'RegisterTournamentInvitationSuccess',
        invitation: result.invitation,
      };
    });
  };
