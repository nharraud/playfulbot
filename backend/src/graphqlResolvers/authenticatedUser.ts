import { AuthenticationError, ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { getUserByID } from '~playfulbot/Model/Users';
import { UserResult } from '~playfulbot/types/graphql';
import { userToUserResult } from './transformations';

export async function authenticatedUserResolver(
  parent: unknown,
  args: unknown,
  context: ApolloContext
): Promise<UserResult> {
  if (!isUserContext(context)) {
    throw new ForbiddenError('Only users are allowed to retrieve the current user');
  }
  if (context.userID) {
    const foundUser = await getUserByID(context.userID);
    if (foundUser) {
      return userToUserResult(foundUser);
    }
  }
  throw new AuthenticationError('User not found');
}
