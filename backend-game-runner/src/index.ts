/* eslint import/first: "off" */
import logger from '~game-runner/logging';

import { createGraphqlServer } from '~game-runner/graphqlServer';
import { startServer as startGrpcServer } from '~game-runner/grpc/server';
import { validateSecretKey } from './secret';

async function main() {
  validateSecretKey();
  await createGraphqlServer();
  startGrpcServer();
}

(async () => {
  await main();
})().catch((error: Error) => {
  logger.error(JSON.stringify(error, null, 2));
  logger.error(error.stack);
});
