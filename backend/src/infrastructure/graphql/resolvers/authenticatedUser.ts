import { AuthenticationError, ForbiddenError } from '~playfulbot/errors';
import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';

export const authenticatedUserResolver: gqlTypes.QueryResolvers<GraphqlContext>['authenticatedUser'] =
  async (parent, args, graphqlContext) => {
    if (!isUserContext(graphqlContext)) {
      throw new ForbiddenError('Only users are allowed to retrieve the current user');
    }
    if (graphqlContext.userID) {
      const foundUser = await graphqlContext.ctx.providers.user.getUserByID(graphqlContext.ctx, graphqlContext.userID);
      if (foundUser) {
        return {
          id: foundUser.id,
          username: foundUser.username,
        };
      }
    }
    throw new AuthenticationError('User not found');
  };
