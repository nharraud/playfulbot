import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { authenticate } from '~playfulbot/graphqlResolvers/authentication';
import * as gqlTypes from '~playfulbot/types/graphql';

interface RegisterUserArguments {
  username: string;
  password: string;
}

export async function registerUserResolver(
  parent: unknown,
  args: RegisterUserArguments,
  ctx: ApolloContext
): Promise<gqlTypes.LoginResult> {
  const newUser = await ctx.userProviddder.createUser(ctx, { username: args.username, password: args.password });

  const token = await authenticate(newUser, ctx.req);
  return {
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
    },
  };
}
