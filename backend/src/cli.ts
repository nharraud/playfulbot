import { Command } from 'commander';
import { startServer as startGraphqlServer } from '~playfulbot/server';
import { startServer as startGrpcServer } from '~playfulbot/grpc/server';
import { createDB, dropDB } from '~playfulbot/Model/db/db_admin';

import db from '~playfulbot/Model/db';
import { disconnect } from './Model/redis';
import { initDemo } from './Model/demo';

async function closeConnections() {
  disconnect();
  await db.$pool.end();
}

async function execute(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .command('serve')
    .description('Start the backend server')
    .action(() => {
      startGraphqlServer();
      startGrpcServer();
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
