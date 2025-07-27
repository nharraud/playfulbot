import { Command } from 'commander';
import { createGraphqlServer } from '~playfulbot/infrastructure/graphql/graphqlServer';
// import { startServer as startGrpcServer } from '~playfulbot/grpc/server';
import { createDB, dropDB } from 'playfulbot-backend-commons/lib/model/db/db_admin';

import { Database } from 'playfulbot-backend-commons/lib/model/db';
import { initDemo } from '~playfulbot/core/use-cases/initDemo';
// import { scheduler } from './scheduling/Scheduler';
import { generateSecretKey, validateSecretKey } from './secret';
import { Context } from './core/use-cases/interfaces/Context';

async function closeConnections(db: Database) {
  await db.disconnectDefault();
}

async function execute(createCtx: () => Promise<Context<Context<any>>>, db: Database, argv: string[]): Promise<void> {
  const program = new Command();

  program
    .command('serve')
    .description('Start the backend server')
    .action(async () => {
      const ctx = (await createCtx()).ctxWithChildLogger({ module: __filename });
      validateSecretKey();
      await createGraphqlServer<Context<any>>(ctx);
      // startGrpcServer();
      // await scheduler.start();
    });

  program
    .command('db-create')
    .description('Create the database')
    .action(async () => {
      try {
        await createDB();
      } finally {
        await closeConnections(db);
      }
    });

  program
    .command('db-drop')
    .description('Drop the database')
    .action(async () => {
      try {
        await dropDB();
      } finally {
        await closeConnections(db);
      }
    });

  program
    .command('load-demo')
    .description('Initialize the database with demo data')
    .action(async () => {
      const ctx = (await createCtx()).ctxWithChildLogger({ module: __filename });
      try {
        await initDemo(ctx, { gameDefinitionId: process.env.DEMO_GAME_ID });
        await ctx.providers.gameRepository.close();
      } finally {
        await closeConnections(db);
      }
    });

  program
    .command('gen-secret')
    .description(
      'Generate a secret key and print it. Provide it as an environment variable when running the server.'
    )
    .action(() => {
      /* eslint-disable no-console */
      console.log(`SECRET KEY: ${generateSecretKey()}\n`);
      console.log('Provide this key to your server as the environment variable "SECRET_KEY"');
      /* eslint-enable no-console */
    });

  await program.parseAsync(argv);
}

export { execute };
