import { ForbiddenError } from 'apollo-server-koa';
import { TournamentNotFoundError } from '~playfulbot/errors';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from '~playfulbot/model/db';
import { Tournament } from '~playfulbot/model/Tournaments';
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
  return Tournament.create(
    args.name,
    args.startDate,
    args.lastRoundDate,
    args.roundsNumber,
    args.minutesBetweenRounds,
    gameDefinition.name,
    db.default
  );
};

export const tournamentResolver: gqlTypes.QueryResolvers<ApolloContext>['tournament'] = async (
  parent,
  args,
  ctx
) => {
  const tournament = await Tournament.getByID(args.tournamentID, db.default);
  if (tournament === null) {
    throw new TournamentNotFoundError();
  }
  return tournament;
};
