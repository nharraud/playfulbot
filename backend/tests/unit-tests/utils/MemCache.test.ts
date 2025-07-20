import { vi, afterEach, describe, expect, test as baseTest } from 'vitest';
import { MemCache } from '~playfulbot/utils/MemCache';

const CLEAN_TIMEOUT = 5000;

async function cacheFixture({}, use: any) {
  await use(new MemCache<string, number>(CLEAN_TIMEOUT));
}

interface TestFixtures {
  cache: MemCache<string, number>,
};

const test = baseTest.extend<TestFixtures>({
  cache: cacheFixture,
});

describe('utils/MemCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  })
  afterEach<TestFixtures>(({ cache }) => {
    cache.stopCleaning();
    vi.useRealTimers();
  });

  test('should return undefined if the key was not set', ({ cache }) => {
    const value = cache.get('unknown');
    expect(value).toBeUndefined();
  });

  test('should return the value if the key was set and the cleaning time did not pass', ({ cache }) => {
    cache.set('known', 42);
    vi.advanceTimersByTime(CLEAN_TIMEOUT);
    const value = cache.get('known');
    expect(value).toEqual(42);
  });

  test('should return undefined if the key was set and the cleaning time did pass', ({ cache }) => {
    cache.set('known', 42);
    vi.advanceTimersByTime(CLEAN_TIMEOUT * 2);
    const value = cache.get('known');
    expect(value).toBeUndefined();
  });

  test('should return the value if the key was set, the value was accessed before the cleaning time passed', ({ cache }) => {
    cache.set('known', 42);
    vi.advanceTimersByTime(CLEAN_TIMEOUT);
    const value = cache.get('known');
    vi.advanceTimersByTime(CLEAN_TIMEOUT);
    expect(value).toEqual(42);
  });
});