import { ForbiddenError } from 'apollo-server-koa';
import { TournamentNotFoundError } from '~playfulbot/errors';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from '~playfulbot/model/db';
import { Round } from '~playfulbot/model/Round';
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

export async function tournamentRoundsResolver(
  parent: Tournament,
  args: gqlTypes.TournamentRoundsArgs,
  context: ApolloContext
): Promise<gqlTypes.Round[]> {
  // FIXME: this should run in the same transaction as the parent query
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const result = await parent.getRounds(args.maxSize, db.default, {
    before: args.before,
    after: args.after,
  });
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  return result;
}
