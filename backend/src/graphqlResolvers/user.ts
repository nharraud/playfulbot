import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { User } from '~playfulbot/model/User';
import * as gqlTypes from '~playfulbot/types/graphql';
import { db } from '~playfulbot/model/db';
import { Team } from '~playfulbot/model/Team';

export async function userTeamsResolver(
  parent: User,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Team[]> {
  // FIXME: this should run in the same transaction as the parent query
  return Team.getAll({ memberID: parent.id }, db.default);
}
