import koa from 'koa';
import cors from '@koa/cors';

import apolloServer from '~playfulbot/graphqlServer';

import logger from '~playfulbot/logging';

import { initDemo } from '~playfulbot/Model';

const app = new koa();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

apolloServer.applyMiddleware({ app });

const httpServer = app.listen({ port: 4000 }, () =>
  logger.info(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
);

apolloServer.installSubscriptionHandlers(httpServer);

initDemo().catch((reason) => {
  console.log(reason);
});
