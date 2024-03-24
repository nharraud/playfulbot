import GraphQLJSON from 'graphql-type-json';

import { IResolvers } from '@graphql-tools/utils';
import { gameResolver, playResolver } from '~game-runner/graphqlResolvers/game';
import { pingResolver } from '~game-runner/graphqlResolvers/ping';
import * as gqlTypes from '~game-runner/types/graphql';
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
