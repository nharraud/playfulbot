import { User } from '~playfulbot/model/User';
import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { authenticate } from '~playfulbot/graphqlResolvers/authentication';
import * as gqlTypes from '~playfulbot/types/graphql';
import { db } from '~playfulbot/model/db';

interface RegisterUserArguments {
  username: string;
  password: string;
}

export async function registerUserResolver(
  parent: unknown,
  args: RegisterUserArguments,
  { koaContext }: ApolloContext
): Promise<gqlTypes.LoginResult> {
  const newUser = await User.create(args.username, args.password, db.default);

  const token = await authenticate(newUser, koaContext);
  return {
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
    },
  };
}
