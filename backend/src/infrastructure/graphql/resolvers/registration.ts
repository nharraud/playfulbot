import { GraphqlContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import { authenticate } from '~playfulbot/infrastructure/graphql/resolvers/authentication';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { GraphQLError } from 'graphql';
import { validateUserName } from '~playfulbot/core/entities/Users';
import { InvalidArgument } from '../../../errors';
import { UsernameAlreadyTaken } from '~playfulbot/core/use-cases/interfaces/UserProvider';

interface RegisterUserArguments {
  username: string;
  password: string;
}

export const registerUserResolver: gqlTypes.MutationResolvers<GraphqlContext>['registerUser'] = async function registerUserResolver(
  parent: unknown,
  args: RegisterUserArguments,
  apolloContext: GraphqlContext
): Promise<gqlTypes.UserRegistrationResult> {
  const usernameError = validateUserName(args.username);
  if (usernameError) {
    return { __typename: 'ValidationError', message: JSON.stringify({ username: [usernameError] })};
  }
  // TODO: validate password complexity. Later replace it with passkey.
  const createUserResult = await apolloContext.ctx.providers.user.createUser(apolloContext.ctx, { username: args.username, password: args.password });
  if (createUserResult instanceof UsernameAlreadyTaken) {
    return { __typename: 'UsernameAlreadyTaken', message: 'username already taken'}
  }

  const { token, fingerprint } = await authenticate(createUserResult);
  apolloContext.ctx.fingerprint = fingerprint;
  return {
    __typename: 'LoginResult',
    token,
    user: {
      id: createUserResult.id,
      username: createUserResult.username,
    },
  };
}
