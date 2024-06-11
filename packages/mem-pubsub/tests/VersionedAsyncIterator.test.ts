import { describe, test, expect } from 'vitest';
import { VersionedAsyncIterator } from '../src/VersionedAsyncIterator';

// eslint-disable-next-line @typescript-eslint/require-await
async function* enumerate<T>(firstVersion = 0, keys: T[]) {
  let version = firstVersion;
  for (const key of keys) {
    yield { key, version };
    version += 1;
  }
}

describe('VersionedAsyncIterator', () => {
  test('should return the initial version before the next versions', async () => {
    const wrappedIterator = enumerate(0, [1, 2, 3]);
    const expectedIterator = enumerate(0, [1, 2, 3]);
    const initialValue = { key: 'init', version: -1 };
    const versionedIterator = new VersionedAsyncIterator(wrappedIterator, () =>
      Promise.resolve(initialValue)
    );

    expect(await versionedIterator.next()).toMatchObject({ done: false, value: initialValue });
    for await (const expected of expectedIterator) {
      expect(await versionedIterator.next()).toMatchObject({ done: false, value: expected });
    }
    expect(await versionedIterator.next()).toMatchObject({ done: true, value: undefined });
  });

  test('should skip all versions which are before the initial version', async () => {
    const wrappedIterator = enumerate(0, [1, 2, 3]);
    const expectedIterator = enumerate(1, [42, 3]);
    const initialValue = { key: 42, version: 1 };
    const versionedIterator = new VersionedAsyncIterator(wrappedIterator, () =>
      Promise.resolve(initialValue)
    );

    for await (const expected of expectedIterator) {
      expect(await versionedIterator.next()).toMatchObject({ done: false, value: expected });
    }
    expect(await versionedIterator.next()).toMatchObject({ done: true, value: undefined });
  });

  test('should skip whole iterator if every version is before the initial version', async () => {
    const wrappedIterator = enumerate(0, [1, 2, 3]);
    const initialValue = { key: 42, version: 3 };
    const versionedIterator = new VersionedAsyncIterator(wrappedIterator, () =>
      Promise.resolve(initialValue)
    );

    expect(await versionedIterator.next()).toMatchObject({ done: false, value: initialValue });
    expect(await versionedIterator.next()).toMatchObject({ done: true, value: undefined });
  });

  test('should skip whole iterator if every version is before or same as the initial version', async () => {
    const wrappedIterator = enumerate(0, [1, 2, 3]);
    const initialValue = { key: 42, version: 2 };
    const versionedIterator = new VersionedAsyncIterator(wrappedIterator, () =>
      Promise.resolve(initialValue)
    );

    expect(await versionedIterator.next()).toMatchObject({ done: false, value: initialValue });
    expect(await versionedIterator.next()).toMatchObject({ done: true, value: undefined });
  });

  test('should forward "throw" call to nested iterator but still return initial value', async () => {
    const wrappedIterator = enumerate(0, [1, 2, 3]);
    const initialValue = { key: 42, version: 2 };
    const versionedIterator = new VersionedAsyncIterator(wrappedIterator, () =>
      Promise.resolve(initialValue)
    );
    const res = versionedIterator.throw(new Error('Expected'));
    await expect(res).rejects.toThrowError(new Error('Expected'));
    await expect(versionedIterator.next()).resolves.toEqual({
      done: false,
      value: { key: 42, version: 2 },
    });
    await expect(versionedIterator.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    await expect(wrappedIterator.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
  });
});
