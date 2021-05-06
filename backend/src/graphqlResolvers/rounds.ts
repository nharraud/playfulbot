import { db } from '~playfulbot/model/db';
import { Round } from '~playfulbot/model/Round';
import { Team } from '~playfulbot/model/Team';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { RoundNotFoundError } from '~playfulbot/errors';
import * as gqlTypes from '~playfulbot/types/graphql';

export async function roundTeamPointsResolver(
  parent: Round,
  args: gqlTypes.TournamentRoundsArgs,
  ctx: ApolloContext
): Promise<number | undefined> {
  if (!isUserContext(ctx)) {
    return undefined;
  }
  return db.default.tx(async (tx) => {
    const team = await Team.getByMember(ctx.userID, parent.tournamentID, tx);
    if (team === undefined) {
      return undefined;
    }
    const teamPoints = await parent.getTeamPoints(team.id, tx);
    return teamPoints;
  });
}

export const roundResolver: gqlTypes.QueryResolvers<ApolloContext>['round'] = async (
  parent,
  args,
  ctx
) => {
  const round = await Round.getByID(args.roundID, db.default);
  if (round === null) {
    throw new RoundNotFoundError();
  }
  return round;
};

export async function roundTeamGamesResolver(
  parent: Round,
  args: gqlTypes.RoundTeamGamesArgs,
  context: ApolloContext
): Promise<gqlTypes.Round[]> {
  return parent.getGamesFromParticipatingTeam(args.teamID, db.default);
}
