import { ApolloContext } from '~team_builder/types/apolloTypes';
import { users } from '~team_builder/Model/Users';

export function authenticatedUserResolver(parent: any, args: any, { koaContext, user }: ApolloContext) {
    if (user) {
      const foundUser = users.find(userElt => userElt.id === user);
      if (foundUser) {
        return {
          id: foundUser.id,
          username: foundUser.name
        }
      }
    }
  }