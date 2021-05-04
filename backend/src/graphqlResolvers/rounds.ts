import { db } from '~playfulbot/model/db';
import { Round } from '~playfulbot/model/Round';
import { Team } from '~playfulbot/model/Team';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
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
