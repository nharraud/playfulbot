import { ForbiddenError } from '~playfulbot/errors';
import { GraphqlContext, isUserContext } from '~playfulbot/infrastructure/graphql/types/graphqlTypes';
import * as gqlTypes from '~playfulbot/infrastructure/graphql/types/graphql';
import { getGameDefinitions } from '~playfulbot/core/use-cases/game/getGameDefinitions';

export const gameDefinitionsResolver: gqlTypes.QueryResolvers<GraphqlContext>['gameDefinitions'] =
  async (parent, args, graphqlContext) => {
    if (!isUserContext(graphqlContext)) {
      throw new ForbiddenError('Only authenticated users are allowed to list game definitions.');
    }
    return getGameDefinitions(graphqlContext.ctx);
  };
