/* eslint import/first: "off" */
import logger from './logging.js';
import { createGraphqlServer } from './graphqlServer.js';
import { startServer as startGrpcServer } from './grpc/server.js';
import { validateSecretKey } from './secret.js';
async function main() {
    validateSecretKey();
    await createGraphqlServer();
    startGrpcServer();
}
(async () => {
    await main();
})().catch((error) => {
    logger.error(JSON.stringify(error, null, 2));
    logger.error(error.stack);
});
//# sourceMappingURL=index.js.map