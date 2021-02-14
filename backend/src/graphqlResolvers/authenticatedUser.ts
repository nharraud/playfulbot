import { AuthenticationError, ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { getUserById } from '~playfulbot/Model/Users';
import { UserResult } from '~playfulbot/types/graphql';

export function authenticatedUserResolver(
  parent: unknown,
  args: unknown,
  context: ApolloContext
): UserResult {
  if (!isUserContext(context)) {
    throw new ForbiddenError('Only users are allowed to retrieve the current user');
  }
  if (context.userID) {
    const foundUser = getUserById(context.userID);
    if (foundUser) {
      return {
        id: foundUser.id,
        username: foundUser.username,
      };
    }
  }
  throw new AuthenticationError('User not found');
}
