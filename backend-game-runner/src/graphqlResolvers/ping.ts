import { ApolloContext } from '~game-runner/types/apolloTypes';
import * as gqlTypes from '~game-runner/types/graphql';

export const pingResolver: gqlTypes.QueryResolvers<ApolloContext>['ping'] = (): boolean => {
  return true;
};
