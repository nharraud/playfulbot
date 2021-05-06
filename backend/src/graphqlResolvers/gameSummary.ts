import { db } from '~playfulbot/model/db';
import { ApolloContext } from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';
import { GameSummary } from '~playfulbot/model/GameSummary';

export async function gameSummaryWinnersResolver(
  parent: GameSummary,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Team[]> {
  return parent.getWinners(db.default);
}

export async function gameSummaryLosersResolver(
  parent: GameSummary,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Team[]> {
  return parent.getLosers(db.default);
}
