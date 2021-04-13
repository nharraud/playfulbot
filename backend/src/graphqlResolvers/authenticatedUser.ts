import { AuthenticationError, ForbiddenError } from 'apollo-server-koa';
import { ApolloContext, isUserContext } from '~playfulbot/types/apolloTypes';
import { getUserByID } from '~playfulbot/model/Users';
import * as gqlTypes from '~playfulbot/types/graphql';

export const authenticatedUserResolver: gqlTypes.QueryResolvers<ApolloContext>['authenticatedUser'] = async (
  parent,
  args,
  ctx
) => {
  if (!isUserContext(ctx)) {
    throw new ForbiddenError('Only users are allowed to retrieve the current user');
  }
  if (ctx.userID) {
    const foundUser = await getUserByID(ctx.userID);
    if (foundUser) {
      return {
        id: foundUser.id,
        username: foundUser.username,
      };
    }
  }
  throw new AuthenticationError('User not found');
};
