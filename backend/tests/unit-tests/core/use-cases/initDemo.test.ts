import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB, initTestDB } from '../../../utils/psql';
import { initDemo } from '~playfulbot/core/use-cases/initDemo';
import { createMockContext } from '../../../utils/context';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';


interface TestFixtures {
  ctx: Context<any>,
}

async function contextFixture({}, use: any) {
  await use(createMockContext());
}

const test = baseTest.extend<TestFixtures>({
  ctx: contextFixture,
});

describe('use-cases/initDemo', () => {
  beforeEach(async () => {
    await initTestDB()
  });

  afterEach(async () => {
    await dropTestDB();
  })

  test('should init and stop', async ({ ctx }) => {
    await initDemo(ctx, { gameDefinitionId: 'TestGame' })
  });
});
