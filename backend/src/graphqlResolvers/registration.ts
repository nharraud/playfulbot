import { createUser } from '~playfulbot/Model/Users';
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
  { koaContext }: ApolloContext
): Promise<gqlTypes.LoginResult> {
  const newUser = await createUser(args.username, args.password);

  const token = await authenticate(newUser, koaContext);
  return {
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
    },
  };
}
