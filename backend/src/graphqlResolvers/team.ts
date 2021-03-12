import { ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { Team, TeamID, TournamentID, UserID } from '~playfulbot/types/backend';
import { InvalidRequest } from '~playfulbot/errors';
import db from '~playfulbot/Model/db';
import { userToUserResult } from './transformations';
import { UserResult } from '~playfulbot/types/graphql';

interface TeamQueryArguments {
  userID: UserID;
  tournamentID: TournamentID;
}

export async function teamResolver(
  parent: unknown,
  args: TeamQueryArguments,
  context: ApolloContext
): Promise<Team> {
  // if (!isUserContext(context)) {
  //   throw new ForbiddenError('Only Users can ask for memberships.');
  // }
  const team = await db.teams.getByMember(args.userID, args.tournamentID);
  if (team === null) {
    throw new InvalidRequest('User is not part of any team in this tournament.');
  }
  return team;
}

interface TeamMembersQueryArguments {
  teamID?: TeamID;
}

export async function teamMembersResolver(
  parent: Team | undefined,
  args: TeamMembersQueryArguments,
  context: ApolloContext
): Promise<UserResult[]> {
  const result = await db.teams.getMembers(args.teamID || parent?.id);
  return result.map(userToUserResult);
}
