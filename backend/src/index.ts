import koa from 'koa';
import cors from '@koa/cors';

const { ApolloServer, gql, PubSub } = require('apollo-server-koa');
const GraphQLJSON = require('graphql-type-json');
// const { typeDefs, resolvers } = require('./schema');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  scalar JSON

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID
    title: String
    author: String
    myData: JSON
  }

  type Subscription {
    myDataPatched: JSON
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;


const books = [
  {
    id: 0,
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: 1,
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const pubsub = new PubSub();

const MY_DATA_PATCHED = 'MY_DATA_PATCHED';

const resolvers = {
  Subscription: {
    myDataPatched: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([MY_DATA_PATCHED]),
    },
  },
  Query: {
    books: () => books,
  },
  JSON: GraphQLJSON,
};
let counter = 0;

function intervalFunc() {
  pubsub.publish(MY_DATA_PATCHED, {
    myDataPatched: [
        { "op": "replace", "path": "/books/0/title", "value": `Updated 1 ${counter}` },
        // { "op": "replace", "path": "/books/1/title", "value": `Updated 2 ${counter}` },
      // title: `Never Ending Story ${counter}`,
      // author: `Infinite Loop ${counter}`,
      ]
  });
  counter += 1;
}

setInterval(intervalFunc, 3000);


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
