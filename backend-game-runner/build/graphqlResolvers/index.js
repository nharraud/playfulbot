import GraphQLJSON from 'graphql-type-json';
import { gameResolver, playResolver } from '../graphqlResolvers/game.js';
import { pingResolver } from '../graphqlResolvers/ping.js';
import { DateScalar } from './scalars/DateScalar.js';
const resolvers = {
    Query: {
        ping: pingResolver,
    },
    Subscription: {
        game: gameResolver,
    },
    Mutation: {
        play: playResolver,
    },
    JSON: GraphQLJSON,
    Date: DateScalar,
};
export default resolvers;
//# sourceMappingURL=index.js.map