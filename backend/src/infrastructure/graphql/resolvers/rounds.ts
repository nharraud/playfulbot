import { db } from '~playfulbot/model/db';
import { Round } from '~playfulbot/model/Round';
import { Team } from '~playfulbot/infrastructure/TeamsPSQL';
import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import { RoundNotFoundError } from '~playfulbot/errors';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';

export async function roundTeamPointsResolver(
  parent: Round,
  args: gqlTypes.TournamentRoundsArgs,
  ctx: GraphqlContext
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

export const roundResolver: gqlTypes.QueryResolvers<GraphqlContext>['round'] = async (
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
  context: GraphqlContext
): Promise<gqlTypes.Round[]> {
  return parent.getGamesFromParticipatingTeam(args.teamID, db.default);
}
