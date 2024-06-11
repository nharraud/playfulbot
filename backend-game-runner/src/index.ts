/* eslint import/first: "off" */
import logger from '~game-runner/infrastructure/logging';

import { createGraphqlServer } from '~game-runner/infrastructure/graphql/graphqlServer';
import { startServer as startGrpcServer } from '~game-runner/infrastructure/grpc/server';
import { validateSecretKey } from './secret';
import { RunningGameRepositoryInMemory } from './infrastructure/games/RunningGameRepositoryInMemory';
import { GameScheduler } from './core/use-cases/game-scheduling/GameScheduler';
import { PSQLGameProvider } from './infrastructure/games/PSQLGameProvider';
import { getGameDefinitions } from './infrastructure/games/gameDefinitions';

async function main() {
  validateSecretKey();

  const gameRepository = new RunningGameRepositoryInMemory();

  await createGraphqlServer({ gameRepository });
  startGrpcServer();

  const gameDefinitions = await getGameDefinitions();
  const gameProvider = new PSQLGameProvider(gameDefId => Promise.resolve(gameDefinitions.get(gameDefId)));
  const gameScheduler = new GameScheduler(gameProvider, gameRepository, { maxGames: 1 });
  await gameScheduler.start();
}

(async () => {
  await main();
})().catch((error: Error) => {
  logger.error(JSON.stringify(error, null, 2));
  logger.error(error.stack);
});
