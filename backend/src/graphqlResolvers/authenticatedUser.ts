import { AuthenticationError, ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { User } from '~playfulbot/model/User';
import * as gqlTypes from '~playfulbot/types/graphql';
import { db } from '~playfulbot/model/db';

export const authenticatedUserResolver: gqlTypes.QueryResolvers<ApolloContext>['authenticatedUser'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new ForbiddenError('Only users are allowed to retrieve the current user');
  }
  if (ctx.userID) {
    const foundUser = await User.getByID(ctx.userID, db.default);
    if (foundUser) {
      return {
        id: foundUser.id,
        username: foundUser.username,
      };
    }
  }
  throw new AuthenticationError('User not found');
};
