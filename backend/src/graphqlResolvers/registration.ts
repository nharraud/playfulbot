import { createUser } from '~playfulbot/Model/Users';
import { ApolloContext } from '~playfulbot/types/apolloTypes';
import { LoginResult } from '~playfulbot/types/graphql';
import { authenticate } from '~playfulbot/graphqlResolvers/authentication';

interface RegisterUserArguments {
  username: string;
  password: string;
}

export async function registerUserResolver(
  parent: unknown,
  args: RegisterUserArguments,
  { koaContext }: ApolloContext
): Promise<LoginResult> {
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
