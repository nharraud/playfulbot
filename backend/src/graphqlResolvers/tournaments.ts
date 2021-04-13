import { ForbiddenError } from 'apollo-server-koa';
import { TournamentNotFoundError } from '~playfulbot/errors';
import { createTournament, getTournamentByID } from '~playfulbot/model/Tournaments';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';

export const createTournamentResolver: gqlTypes.MutationResolvers<ApolloContext>['createTournament'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new ForbiddenError(`Only authenticated users are allowed to create tournaments.`);
  }
  return createTournament(args.name);
};

export const tournamentResolver: gqlTypes.QueryResolvers<ApolloContext>['tournament'] = async (
  parent,
  args,
  ctx
) => {
  const tournament = await getTournamentByID(args.tournamentID);
  if (tournament === null) {
    throw new TournamentNotFoundError();
  }
  return tournament;
};
