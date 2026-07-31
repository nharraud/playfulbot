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
import { updateTournamentConfiguration } from '~playfulbot/core/use-cases/tournament/updateTournamentConfiguration';
import { validateTournamentName } from '~playfulbot/core/entities/Tournaments';
import { getTournamentTeams } from '~playfulbot/core/use-cases/tournament/getTournamentTeams';
import { toGraphQLError } from './errors';

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
      startDate: args.startDate,
      endDate: args.endDate,
    });
  };

export const updateTournamentConfigurationResolver: gqlTypes.MutationResolvers<GraphqlContext>['updateTournamentConfiguration'] =
  async (parent, args, apolloContext) => {
    if (!isUserContext(apolloContext)) {
      throw new ForbiddenError(`Only authenticated users are allowed to update tournaments.`);
    }

    const tournamentNameError = validateTournamentName(args.input.name);
    if (tournamentNameError) {
      return {
        __typename: 'UpdateTournamentConfigurationFailure',
        errors: [{ __typename: 'ValidationError', message: JSON.stringify({ 'input.name': [tournamentNameError] }) }]
      } as gqlTypes.UpdateTournamentConfigurationFailure;
    }

    const result = await updateTournamentConfiguration(apolloContext.ctx, {
      tournamentId: args.tournamentID,
      name: args.input.name,
      startDate: args.input.startDate,
      endDate: args.input.endDate,
      gameDefinitionId: args.input.gameDefinitionId,
    });

    if (result instanceof Error) {
      return {
        __typename: 'UpdateTournamentConfigurationFailure',
        errors: [toGraphQLError(result)],
      } as gqlTypes.UpdateTournamentConfigurationFailure;
    }

    return {
      __typename: 'UpdateTournamentConfigurationSuccess',
      tournament: result,
    } as gqlTypes.UpdateTournamentConfigurationSuccess;
  };

export const tournamentResolver: gqlTypes.QueryResolvers<GraphqlContext>['tournament'] = async (
  parent,
  args,
  apolloContext
) => {
  if (!isUserContext(apolloContext)) {
    throw new ForbiddenError('Only users are allowed to retrieve the current user');
  }
  const all = await apolloContext.ctx.providers.tournament.getAllTournaments(apolloContext.ctx, {});
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


export const tournamentTeamsResolver: gqlTypes.TournamentResolvers<GraphqlContext>['teams'] = async (
  tournament,
  args,
  apolloContext
) => {
  if (!isUserContext(apolloContext)) {
    throw new ForbiddenError('Only users are allowed to retrieve the a tournament\'s teams');
  }
  return getTournamentTeams(apolloContext.ctx, { tournamentId: tournament.id });
}

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
