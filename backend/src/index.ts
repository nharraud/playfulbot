/* eslint import/first: "off" */

import { execute } from '~playfulbot/cli';
import logger from './logging';

async function main() {
  await execute(process.argv);
}

(async () => {
  await main();
})().catch((error: Error) => {
  logger.error(JSON.stringify(error, null, 2));
  logger.error(error.stack);
});
