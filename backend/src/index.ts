/* eslint import/first: "off" */

import { execute } from '~playfulbot/cli';
import { createLogger } from './logging';
import { ContextPSQLImpl } from './infrastructure/providers/ContextPSQL';
import { GameRepositoryPSQL } from './infrastructure/providers/GameRepositoryPSQL';
import { db } from 'playfulbot-backend-commons/lib/model/db';

const logger = createLogger().child({ module: 'src/index' });

async function createCtx() {
  const gameRepository = await GameRepositoryPSQL.createRepository(db.default);
  return new ContextPSQLImpl({ logger, providers: { gameRepository } });
}

async function main() {
  await execute(createCtx, db, process.argv);
}

(async () => {
  await main();
})().catch((error: Error) => {
  logger.error(JSON.stringify(error, null, 2));
  logger.error(error.stack);
});
