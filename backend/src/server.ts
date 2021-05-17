import koa from 'koa';
import cors from '@koa/cors';

import apolloServer from '~playfulbot/graphqlServer';

import logger from '~playfulbot/logging';
import { serverConfig } from './serverConfig';

export function startServer() {
  const app = new koa();

  app.use(cors({ origin: serverConfig.FRONTEND_URL, credentials: true }));

  apolloServer.applyMiddleware({ app });

  const httpServer = app.listen({ port: serverConfig.GRAPHQL_PORT }, () =>
    logger.info(
      `🚀 Server ready at http://${serverConfig.BACKEND_HOST}:${serverConfig.GRAPHQL_PORT}${apolloServer.graphqlPath}`
    )
  );

  apolloServer.installSubscriptionHandlers(httpServer);
}
