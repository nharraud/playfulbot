import koa from 'koa';
import cors from '@koa/cors';

const { ApolloServer, gql, PubSub } = require('apollo-server-koa');
// const { typeDefs, resolvers } = require('./schema');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Subscription {
    bookAdded: Book
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
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const pubsub = new PubSub();

const BOOK_ADDED = 'BOOK_ADDED';

const resolvers = {
  Subscription: {
    bookAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED]),
    },
  },
  Query: {
    books: () => books,
  },
};
let counter = 0;

function intervalFunc() {
  pubsub.publish(BOOK_ADDED, {
    bookAdded: {
      title: `Never Ending Story ${counter}`,
      author: `Infinite Loop ${counter}`,
    }
  });
  counter += 1;
}

setInterval(intervalFunc, 1000);


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
