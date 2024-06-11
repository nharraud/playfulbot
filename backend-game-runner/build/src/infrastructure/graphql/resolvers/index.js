import GraphQLJSON from 'graphql-type-json';
import { gameResolver, playResolver } from '~game-runner/infrastructure/graphql/resolvers/game';
import { pingResolver } from '~game-runner/infrastructure/graphql/resolvers/ping';
import { DateScalar } from './scalars/DateScalar';
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