import koa from 'koa';
import cors from '@koa/cors';

import { apolloServer } from '~playfulbot/graphqlServer';


const app = new koa();

app.use(cors({origin: 'http://localhost:3000', credentials: true}));

apolloServer.applyMiddleware({ app });

const httpServer = app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
)

apolloServer.installSubscriptionHandlers(httpServer);
