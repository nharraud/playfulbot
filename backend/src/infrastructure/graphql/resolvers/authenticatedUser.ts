import { AuthenticationError, ForbiddenError } from '~playfulbot/errors';
import { ApolloContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/apolloTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';

export const authenticatedUserResolver: gqlTypes.QueryResolvers<ApolloContext>['authenticatedUser'] =
  async (parent, args, apolloContext) => {
    if (!isUserContext(apolloContext)) {
      throw new ForbiddenError('Only users are allowed to retrieve the current user');
    }
    if (apolloContext.userID) {
      const foundUser = await apolloContext.ctx.providers.user.getUserByID(apolloContext.ctx, apolloContext.userID);
      if (foundUser) {
        return {
          id: foundUser.id,
          username: foundUser.username,
        };
      }
    }
    throw new AuthenticationError('User not found');
  };
