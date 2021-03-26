import koa from 'koa';
import cors from '@koa/cors';

import apolloServer from '~playfulbot/graphqlServer';

import logger from '~playfulbot/logging';

export function startServer() {
  const app = new koa();
  let httpPort = 3000;
  if (process.env.HTTP_PORT) {
    httpPort = parseInt(process.env.HTTP_PORT, 10);
  }
  let graphqlPort = 4000;
  if (process.env.GRAPHQL_PORT) {
    graphqlPort = parseInt(process.env.GRAPHQL_PORT, 10);
  }

  app.use(cors({ origin: `http://localhost:${httpPort}`, credentials: true }));

  apolloServer.applyMiddleware({ app });

  const httpServer = app.listen({ port: graphqlPort }, () =>
    logger.info(`🚀 Server ready at http://localhost:${graphqlPort}${apolloServer.graphqlPath}`)
  );

  apolloServer.installSubscriptionHandlers(httpServer);
}
