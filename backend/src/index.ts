/* eslint import/first: "off" */

import { loadConfig } from 'playfulbot-config-loader';
import { execute } from '~playfulbot/cli';
import { gameDefinitions } from '~playfulbot/model/GameDefinition';
import logger from './logging';
import { handleRestart } from './model/handleRestart';

async function main() {
  const config = await loadConfig();
  const { gameDefinition } = await import(config.games.wallrace);
  const backendGameDefinition = gameDefinition.backend;
  gameDefinitions.set(backendGameDefinition.name, backendGameDefinition);
  await execute(process.argv);
}

(async () => {
  await main();
})().catch((error: Error) => {
  logger.error(JSON.stringify(error, null, 2));
  logger.error(error.stack);
});
