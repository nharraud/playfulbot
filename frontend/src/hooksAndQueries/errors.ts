import { ApolloError } from '@apollo/client';

export function containsNotFoundError(error: ApolloError) {
  const notFoundError = error.graphQLErrors.find(
    (graphQLError) => graphQLError.extensions.code === 'NOT_FOUND'
  );
  return notFoundError !== undefined;
}
