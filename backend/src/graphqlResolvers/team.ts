import { ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { Team, UserID } from '~playfulbot/types/backend';
import { getTeamMemberID } from '~playfulbot/Model/Teams';
import { InvalidRequest } from '~playfulbot/errors';

interface TeamQueryArguments {
  userID: UserID;
}

export async function teamResolver(
  parent: unknown,
  args: TeamQueryArguments,
  context: ApolloContext
): Promise<Team> {
  // if (!isUserContext(context)) {
  //   throw new ForbiddenError('Only Users can ask for teams.');
  // }
  const team = getTeamMemberID(args.userID);
  if (team === undefined) {
    throw new InvalidRequest('User is not part of any team');
  }
  return Promise.resolve(team);
}
