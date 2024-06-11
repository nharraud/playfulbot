import { ApolloContext } from '~game-runner/infrastructure/graphql/types/apolloTypes';
import * as gqlTypes from '~game-runner/infrastructure/graphql/types/graphql';

export const pingResolver: gqlTypes.QueryResolvers<ApolloContext>['ping'] = (): boolean => {
  return true;
};
