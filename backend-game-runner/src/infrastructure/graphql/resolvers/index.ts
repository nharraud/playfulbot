import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from '@graphql-tools/utils';
import { gameResolver, playResolver } from '~game-runner/infrastructure/graphql/resolvers/game';
import { pingResolver } from '~game-runner/infrastructure/graphql/resolvers/ping';
import * as gqlTypes from '~game-runner/infrastructure/graphql/types/graphql';
import { DateScalar } from './scalars/DateScalar';

const resolvers: IResolvers = {
  Query: {
    ping: pingResolver,
  },
  Subscription: {
    game: gameResolver,
  } as gqlTypes.SubscriptionResolvers,
  Mutation: {
    play: playResolver,
  } as gqlTypes.MutationResolvers,
  JSON: GraphQLJSON,
  Date: DateScalar,
};

export default resolvers;
