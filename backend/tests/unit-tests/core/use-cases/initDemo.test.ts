import { beforeEach, afterEach, describe, expect, test as baseTest } from 'vitest';
import { dropTestDB, initTestDB } from '../../../utils/psql';
import { initDemo } from '~playfulbot/core/use-cases/initDemo';
import { createMockContext } from '../../../utils/context';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';
import { mockContextFixture } from 'tests/utils/fixtures';


interface TestFixtures {
  ctx: ContextPSQL,
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
});

describe('use-cases/initDemo', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  })

  test('should init and stop', async ({ ctx }) => {
    await initDemo(ctx, { gameDefinitionId: 'TestGame' })
  });
});
