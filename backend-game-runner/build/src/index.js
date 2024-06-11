/* eslint import/first: "off" */
import logger from '~game-runner/infrastructure/logging';
import { createGraphqlServer } from '~game-runner/infrastructure/graphql/graphqlServer';
import { startServer as startGrpcServer } from '~game-runner/infrastructure/grpc/server';
import { validateSecretKey } from './secret';
import { GameInMemoryRepository } from './infrastructure/games/gameInMemoryRepository';
async function main() {
    validateSecretKey();
    const gameRepository = new GameInMemoryRepository();
    await createGraphqlServer({ gameRepository });
    startGrpcServer();
}
(async () => {
    await main();
})().catch((error) => {
    logger.error(JSON.stringify(error, null, 2));
    logger.error(error.stack);
});
//# sourceMappingURL=index.js.map