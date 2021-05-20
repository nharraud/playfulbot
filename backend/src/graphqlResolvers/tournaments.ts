import { TournamentNotFoundError, ForbiddenError, BotsForbiddenError } from '~playfulbot/errors';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from '~playfulbot/model/db';
import { Round } from '~playfulbot/model/Round';
import { TournamentRoleName } from '~playfulbot/model/TournamentRole';
import { Tournament } from '~playfulbot/model/Tournaments';
import {
  ApolloContext,
  isBotContext,
  isUnauthenticatedContext,
  isUserContext,
} from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';

export const createTournamentResolver: gqlTypes.MutationResolvers<ApolloContext>['createTournament'] =
  async (parent, args, ctx) => {
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
      ctx.userID,
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
  const result = await parent.getRounds(
    {
      startingBefore: args.before,
      startingAfter: args.after,
      maxSize: args.maxSize,
    },
    db.default
  );
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  return result;
}

export function tournamentTeamsResolver(
  parent: Tournament,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Round[]> {
  // FIXME: this should run in the same transaction as the parent query
  return parent.getTeams(db.default);
}

export function tournamentInvitationIDResolver(
  parent: Tournament,
  args: undefined,
  ctx: ApolloContext
): Promise<string> {
  if (isBotContext(ctx)) {
    throw new BotsForbiddenError();
  }
  if (isUnauthenticatedContext(ctx)) {
    return null;
  }
  // FIXME: this should run in the same transaction as the parent query
  return db.default.tx(async (tx) => {
    const role = await parent.getUserRole(ctx.userID, tx);
    if (role !== TournamentRoleName.Admin) {
      return null;
    }
    const result = await parent.getInvitationLink(db.default);
    return result.id;
  });
}

export async function tournamentMyRolesResolver(
  parent: Tournament,
  args: undefined,
  ctx: ApolloContext
): Promise<gqlTypes.TournamentRoleName> {
  if (isBotContext(ctx)) {
    throw new BotsForbiddenError();
  }
  if (isUnauthenticatedContext(ctx)) {
    return null;
  }

  const result = await parent.getUserRole(ctx.userID, db.default);
  return result;
}
