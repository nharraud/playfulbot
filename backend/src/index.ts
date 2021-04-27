/* eslint import/first: "off" */

import { execute } from '~playfulbot/cli';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { gameDefinitions } from '~playfulbot/model/GameDefinition';
import logger from './logging';
import { handleRestart } from './model/handleRestart';

async function main() {
  gameDefinitions.set(gameDefinition.name, gameDefinition);

  await handleRestart();
  await execute(process.argv);
}

(async () => {
  await main();
})().catch((error: Error) => {
  logger.error(JSON.stringify(error, null, 2));
  logger.error(error.stack);
});
