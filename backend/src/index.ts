import koa from 'koa';
import cors from '@koa/cors';

import { init, actions } from "~team_builder/games/tictactoe";

const { ApolloServer, gql, PubSub } = require('apollo-server-koa');
const GraphQLJSON = require('graphql-type-json');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar JSON

  # type Mutation {
  #   # TODO: add mutation to send game actions
  # }

  type Subscription {
    gamePatch: JSON
  }

  type Query {
    game: JSON
  }
`;

const gameState = init();

const pubsub = new PubSub();

const GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';

const resolvers = {
  Subscription: {
    gamePatch: {
    subscribe: () => pubsub.asyncIterator([GAME_STATE_CHANGED]),
    },
  },
  Query: {
    game: () => gameState,
  },
  JSON: GraphQLJSON,
};

let counter2 = 0;
function intervalFunc2() {
  let symbol: string = "";
  if (counter2 % 3 == 0) {
    symbol = "x";
  } else if (counter2 % 3 == 1) {
    symbol = "o";
  }
  pubsub.publish(GAME_STATE_CHANGED, {
    gamePatch: [
        { "op": "replace", "path": "/game/grid/0", "value": symbol },
      ]
  });
  counter2 += 1;
}
setInterval(intervalFunc2, 1000);


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = new koa();

app.use(cors({origin: 'http://localhost:3000'}));

server.applyMiddleware({ app });

const httpServer = app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

server.installSubscriptionHandlers(httpServer);
