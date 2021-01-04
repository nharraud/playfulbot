import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { users } from '~playfulbot/Model/Users';

export function authenticatedUserResolver(parent: any, args: any, { koaContext, userID }: ApolloContext) {
  if (userID) {
    const foundUser = users.find(userElt => userElt.id === userID);
    if (foundUser) {
      return {
        id: foundUser.id,
        username: foundUser.name
      }
    }
  }
}