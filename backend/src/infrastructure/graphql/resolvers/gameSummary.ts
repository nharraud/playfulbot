import { db } from '~playfulbot/model/db';
import { GraphqlContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { GameSummary } from '~playfulbot/model/GameSummary';

export async function gameSummaryWinnersResolver(
  parent: GameSummary,
  args: undefined,
  context: GraphqlContext
): Promise<gqlTypes.Team[]> {
  return parent.getWinners(db.default);
}

export async function gameSummaryLosersResolver(
  parent: GameSummary,
  args: undefined,
  context: GraphqlContext
): Promise<gqlTypes.Team[]> {
  return parent.getLosers(db.default);
}
