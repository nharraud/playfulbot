import { AuthenticationError, ForbiddenError } from '~playfulbot/errors';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import * as gqlTypes from '~playfulbot/types/graphql';

export const authenticatedUserResolver: gqlTypes.QueryResolvers<ApolloContext>['authenticatedUser'] =
  async (parent, args, ctx) => {
    if (!isUserContext(ctx)) {
      throw new ForbiddenError('Only users are allowed to retrieve the current user');
    }
    if (ctx.userID) {
      const foundUser = await ctx.userProviddder.getUserByID(ctx, ctx.userID);
      if (foundUser) {
        return {
          id: foundUser.id,
          username: foundUser.username,
        };
      }
    }
    throw new AuthenticationError('User not found');
  };
