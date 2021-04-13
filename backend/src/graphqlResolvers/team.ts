import { ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { DbTeam, TeamID, TournamentID, UserID } from '~playfulbot/types/database';
import { InvalidRequest } from '~playfulbot/errors';
import db from '~playfulbot/model/db';
import * as gqlTypes from '~playfulbot/types/graphql';

export const teamResolver: gqlTypes.QueryResolvers<ApolloContext>['team'] = async (
  parent,
  args,
  ctx
) => {
  // if (!isUserContext(context)) {
  //   throw new ForbiddenError('Only Users can ask for memberships.');
  // }
  const team = await db.teams.getByMember(args.userID, args.tournamentID);
  if (team === null) {
    return {
      __typename: 'UserNotPartOfAnyTeam',
      message: 'User is not part of any team in this tournament',
    };
  }
  return {
    __typename: 'Team',
    ...team,
  };
};

interface TeamMembersQueryArguments {
  teamID?: TeamID;
}

export async function teamMembersResolver(
  parent: DbTeam | undefined,
  args: TeamMembersQueryArguments,
  context: ApolloContext
): Promise<gqlTypes.User[]> {
  const result = await db.teams.getMembers(args.teamID || parent?.id);
  return result.map((user) => ({
    id: user.id,
    username: user.username,
  }));
}
