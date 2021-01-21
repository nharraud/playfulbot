import { AuthenticationError } from 'apollo-server-koa';
import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { users } from '~playfulbot/Model/Users';
import { User } from '~playfulbot/types/graphql';

export function authenticatedUserResolver(
  parent: unknown,
  args: unknown,
  { koaContext, userID }: ApolloContext
): User {
  if (userID) {
    const foundUser = users.find((userElt) => userElt.id === userID);
    if (foundUser) {
      return {
        id: foundUser.id,
        username: foundUser.name,
      };
    }
  }
  throw new AuthenticationError('User not found');
}
