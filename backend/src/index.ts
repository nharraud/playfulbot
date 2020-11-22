import koa from 'koa';
import cors from '@koa/cors';

const { ApolloServer, gql, PubSub } = require('apollo-server-koa');
const GraphQLJSON = require('graphql-type-json');

import * as jsonpatch from "fast-json-patch";

import { init, actions } from "~team_builder/games/tictactoe";

import { UnknownAction } from "./Errors";

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar JSON

  type Mutation {
    play(action: String!, data: JSON!): JSON
  }

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
  Mutation: {
    play: (parent: any, args: any, context: any, info: any) => {
      console.log("playing " + args.action)
      console.log(JSON.stringify(args.data))
      const gameAction = actions.get(args.action);
      if (!gameAction) {
        throw new UnknownAction(args.action);
      }
      const observer = jsonpatch.observe<object>(gameState);
      gameAction.handler(0, gameState, args.data);
      const patch = jsonpatch.generate(observer);
      jsonpatch.unobserve(gameState, observer);
      pubsub.publish(GAME_STATE_CHANGED, {
        gamePatch: patch
      });
    }
  },
  JSON: GraphQLJSON,
};

// let counter2 = 0;
// function intervalFunc2() {
//   let symbol: string = "";
//   if (counter2 % 3 == 0) {
//     symbol = "x";
//   } else if (counter2 % 3 == 1) {
//     symbol = "o";
//   }
//   pubsub.publish(GAME_STATE_CHANGED, {
//     gamePatch: [
//         { "op": "replace", "path": "/game/grid/0", "value": symbol },
//       ]
//   });
//   counter2 += 1;
// }
// setInterval(intervalFunc2, 1000);


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
