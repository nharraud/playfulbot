// import { loadConfig } from 'playfulbot-config-loader';
import { TournamentNotFoundError, ForbiddenError, BotsForbiddenError } from '~playfulbot/errors';
// import { Round } from '~playfulbot/model/Round';
// import { TournamentRoleName } from '~playfulbot/model/TournamentRole';
import {
  GraphqlContext,
  isBotContext,
  isUnauthenticatedContext,
  isUserContext,
} from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { createTournament } from '~playfulbot/core/use-cases/tournament/createTournament';
import { validateTournamentName } from '~playfulbot/core/entities/Tournaments';

export const createTournamentResolver: gqlTypes.MutationResolvers<GraphqlContext>['createTournament'] =
  async (parent, args, apolloContext) => {
    if (!isUserContext(apolloContext)) {
      throw new ForbiddenError(`Only authenticated users are allowed to create tournaments.`);
    }

    // FIXME: validate parameters
    // const tournamentNameError = validateTournamentName(args.name);
    // if (tournamentNameError) {
    //   return {
    //     __typename: 'CreateTournamentFailure',
    //     errors: [{ __typename: 'ValidationError', message: JSON.stringify({ 'input.name': [tournamentNameError] }) }]
    //   } as gqlTypes.CreateTournamentFailure;
    // }

    return createTournament(apolloContext.ctx, {
      tournamentName: args.name,
      lastRoundDate: args.lastRoundDate,
      minutesBetweenRounds: args.minutesBetweenRounds,
      roundsNumber: args.roundsNumber,
      startDate: args.startDate
    });
  };

export const tournamentResolver: gqlTypes.QueryResolvers<GraphqlContext>['tournament'] = async (
  parent,
  args,
  apolloContext
) => {
  if (!isUserContext(apolloContext)) {
    throw new ForbiddenError('Only users are allowed to retrieve the current user');
  }
  const tournament = await apolloContext.ctx.providers.tournament.getTournamentByID(apolloContext.ctx, args.tournamentID);
  if (tournament === null) {
    throw new TournamentNotFoundError();
  }
  return tournament;
};

// export async function tournamentRoundsResolver(
//   parent: Tournament,
//   args: gqlTypes.TournamentRoundsArgs,
//   context: ApolloContext
// ): Promise<gqlTypes.Round[]> {
//   // FIXME: this should run in the same transaction as the parent query
//   /* eslint-disable @typescript-eslint/no-unsafe-assignment */
//   const result = await parent.getRounds(
//     {
//       startingBefore: args.before,
//       startingAfter: args.after,
//       maxSize: args.maxSize,
//     },
//     db.default
//   );
//   /* eslint-enable @typescript-eslint/no-unsafe-assignment */
//   return result;
// }

// export function tournamentTeamsResolver(
//   parent: Tournament,
//   args: undefined,
//   context: ApolloContext
// ): Promise<gqlTypes.Round[]> {
//   // FIXME: this should run in the same transaction as the parent query
//   return parent.getTeams(db.default);
// }

// export function tournamentInvitationIDResolver(
//   parent: Tournament,
//   args: undefined,
//   ctx: ApolloContext
// ): Promise<string> {
//   if (isBotContext(ctx)) {
//     throw new BotsForbiddenError();
//   }
//   if (isUnauthenticatedContext(ctx)) {
//     return null;
//   }
//   // FIXME: this should run in the same transaction as the parent query
//   return db.default.tx(async (tx) => {
//     const role = await parent.getUserRole(ctx.userID, tx);
//     if (role !== TournamentRoleName.Admin) {
//       return null;
//     }
//     const result = await parent.getInvitationLink(db.default);
//     return result.id;
//   });
// }

export const tournamentMyRolesResolver: gqlTypes.TournamentResolvers<GraphqlContext>['myRole'] = async (
  tournament,
  args,
  apolloContext
) => {
  if (!isUserContext(apolloContext)) {
    throw new ForbiddenError('Only users are allowed to retrieve the user role');
  }
  const userId = apolloContext.ctx.requestingUserId;
  return apolloContext.ctx.providers.tournament.getUserRole(apolloContext.ctx, { tournamentId: tournament.id, userId } );
};
