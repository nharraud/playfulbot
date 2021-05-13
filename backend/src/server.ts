import koa from 'koa';
import cors from '@koa/cors';

import apolloServer from '~playfulbot/graphqlServer';

import logger from '~playfulbot/logging';

export function startServer() {
  const app = new koa();

  const allowedCorsOrigin = process.env.ALLOWED_CORS_ORIGIN || 'http://localhost:3000';

  app.use(cors({ origin: allowedCorsOrigin, credentials: true }));

  apolloServer.applyMiddleware({ app });

  let graphqlPort = 4000;
  if (process.env.GRAPHQL_PORT) {
    graphqlPort = parseInt(process.env.GRAPHQL_PORT, 10);
  }

  const httpServer = app.listen({ port: graphqlPort }, () =>
    logger.info(`🚀 Server ready at http://localhost:${graphqlPort}${apolloServer.graphqlPath}`)
  );

  apolloServer.installSubscriptionHandlers(httpServer);
}
