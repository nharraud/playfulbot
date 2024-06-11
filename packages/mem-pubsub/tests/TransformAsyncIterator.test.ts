import { describe, test, expect } from 'vitest';
import { TransformAsyncIterator } from '../src/TransformAsyncIterator';

describe('VersionedAsyncIterator', () => {
  test('should transform the value of the provided iterator before returning it', async () => {
    const wrappedIterator = (async function* () { yield 1; yield 2; })();
    const iterator = new TransformAsyncIterator(wrappedIterator, (nb) => nb + 3);
    const result = [];
    for await (const v of iterator) {
      result.push(v);
    }
    expect(result).toEqual([4, 5]);
  });

  test('should forward "throw" call to nested iterator', async () => {
    const wrappedIterator = (async function* () { yield 1; yield 2; })();
    const iterator = new TransformAsyncIterator(wrappedIterator, (nb) => nb + 3);
    const res = iterator.throw(new Error('Expected'));
    await expect(res).rejects.toThrowError(new Error('Expected'));
    await expect(iterator.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    await expect(wrappedIterator.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
  });
});