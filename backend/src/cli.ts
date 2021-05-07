import { Command } from 'commander';
import { startServer as startGraphqlServer } from '~playfulbot/server';
import { startServer as startGrpcServer } from '~playfulbot/grpc/server';
import { createDB, dropDB } from '~playfulbot/model/db/db_admin';

import { db } from '~playfulbot/model/db';
import { disconnect } from './model/redis';
import { initDemo } from './model/demo';
import { handleRestart } from './model/handleRestart';
import { scheduler } from './scheduling/Scheduler';

async function closeConnections() {
  disconnect();
  await db.disconnectDefault();
}

async function execute(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .command('serve')
    .description('Start the backend server')
    .action(async () => {
      await handleRestart();
      startGraphqlServer();
      startGrpcServer();
      await scheduler.start();
    });

  program
    .command('db-create')
    .description('Create the database')
    .action(async () => {
      try {
        await createDB();
      } finally {
        await closeConnections();
      }
    });

  program
    .command('db-drop')
    .description('Drop the database')
    .action(async () => {
      try {
        await dropDB();
      } finally {
        await closeConnections();
      }
    });

  program
    .command('load-demo')
    .description('Initialize the database with demo data')
    .action(async () => {
      // await db.admin.loadDemo();
      try {
        await initDemo();
      } finally {
        await closeConnections();
      }
    });

  await program.parseAsync(argv);
}

export { execute };
