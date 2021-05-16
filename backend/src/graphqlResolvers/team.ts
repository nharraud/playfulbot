import { ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { InvalidRequest } from '~playfulbot/errors';
import { db } from '~playfulbot/model/db';
import * as gqlTypes from '~playfulbot/types/graphql';
import { Team, TeamID } from '~playfulbot/model/Team';
import { User } from '~playfulbot/model/User';
import { Tournament } from '~playfulbot/model/Tournaments';

export const teamResolver: gqlTypes.QueryResolvers<ApolloContext>['team'] = async (
  parent,
  args,
  ctx
) => {
  // if (!isUserContext(context)) {
  //   throw new ForbiddenError('Only Users can ask for memberships.');
  // }
  const team = await Team.getByMember(args.userID, args.tournamentID, db.default);
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
  parent: Team | undefined,
  args: TeamMembersQueryArguments,
  context: ApolloContext
): Promise<gqlTypes.User[]> {
  // FIXME: this should run in the same transaction as the parent query
  const result = await User.getByTeam(args.teamID || parent?.id, db.default);
  return result.map((user) => ({
    id: user.id,
    username: user.username,
  }));
}

export async function teamTournamentResolver(
  parent: Team,
  args: undefined,
  context: ApolloContext
): Promise<gqlTypes.Tournament> {
  // FIXME: this should run in the same transaction as the parent query
  return Tournament.getByTeam(parent.id, db.default);
}
