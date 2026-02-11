/* eslint import/first: "off" */
import logger from '~game-runner/infrastructure/logging';

import { createGraphqlServer } from '~game-runner/infrastructure/graphql/graphqlServer';
import { createGrpcServer } from '~game-runner/infrastructure/grpc/grpcServer';
import { validateSecretKey } from './secret';
import { RunningGameRepositoryInMemory } from './infrastructure/games/RunningGameRepositoryInMemory';
import { GameScheduler } from './core/use-cases/game-scheduling/GameScheduler';
import { PSQLGameProvider } from './infrastructure/games/PSQLGameProvider';
import { getGameDefinitions } from './infrastructure/games/gameDefinitions';
import { serverConfig } from './serverConfig';
import { AddressInfo } from 'net';

async function main() {
  validateSecretKey();

  const gameRepository = new RunningGameRepositoryInMemory({ maxGames: 3 });
  const deps = { gameRepository };
  const graphqlServer = await createGraphqlServer(deps, { host: serverConfig.GRAPHQL_HOST, port: serverConfig.GRAPHQL_PORT });
  const graphqlAddress = graphqlServer.address() as AddressInfo;
  const { url: grpcUrl } = await createGrpcServer(deps, { host: serverConfig.GRAPHQL_HOST, port: serverConfig.GRPC_PORT });

  const gameDefinitions = await getGameDefinitions();
  const gameProvider = new PSQLGameProvider({
    gameDefinitionsProvider: gameDefId => Promise.resolve(gameDefinitions.get(gameDefId)),
    graphqlUrl: serverConfig.EXPOSED_GRAPHQL_URL || `${graphqlAddress.address}:${graphqlAddress.port}`,
    grpcUrl: serverConfig.EXPOSED_GRPC_URL || grpcUrl,
  });
  const gameScheduler = new GameScheduler(gameProvider, gameRepository);
  await gameScheduler.start();
}

(async () => {
  await main();
})().catch((error: Error) => {
  logger.error(JSON.stringify(error, null, 2));
  logger.error(error.stack);
});
