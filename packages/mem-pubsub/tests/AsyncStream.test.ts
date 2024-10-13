import { describe, test, expect } from 'vitest';
import { AsyncStream } from '~mem-pubsub/AsyncStream';

describe('AsyncStream', () => {
  test('should end when "return" is called', async () => {
    const stream = new AsyncStream();
    const result = await stream.return();
    expect(result.done).to.be.true;
    expect(result.value).to.be.undefined;
    await stream.next();
  });

  test('should end when "complete" is called', async () => {
    const stream = new AsyncStream();
    stream.complete();
    await stream.next();
  });

  test('should return a rejected promise when "throw" is called', async () => {
    const stream = new AsyncStream();
    const res = stream.throw(new Error('Expected'));
    await expect(res).rejects.toThrowError(new Error('Expected'));
    await expect(stream.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
  });

  test('should return all pushed values', async () => {
    const stream = new AsyncStream();
    const promise = new Promise(async (resolve) => {
      const readValues = [];
      for await (const v of stream) {
        readValues.push(v);
      }
      resolve(readValues);
    });
    const sentValues = [1, 2, 3, 4, 5];
    for (const v of sentValues) {
      stream.push(v);
    }
    stream.complete();
    
    const allReadValues = await promise;
    expect(allReadValues).toEqual(sentValues);
  });

  test('should return all pushed values (multiple values in one call)', async () => {
    const stream = new AsyncStream();
    const promise = new Promise(async (resolve) => {
      const readValues = [];
      for await (const v of stream) {
        readValues.push(v);
      }
      resolve(readValues);
    });
    const sentValues = [1, 2, 3, 4, 5];
    stream.push(...sentValues);
    stream.complete();
    
    const allReadValues = await promise;
    expect(allReadValues).toEqual(sentValues);
  });

  test('should resolve waitOnComplete when stream is complete', async () => {
    const stream = new AsyncStream();
    let completed = false;
    setTimeout(async () => {
      stream.complete();
      completed = true;
    }, 500);

    const promiseComplete = new Promise(async (resolve) => {
      await stream.waitOnComplete();
      resolve(completed);
    });
    
    const hasWaitedForCompletion = await promiseComplete;
    expect(hasWaitedForCompletion).toBeTruthy();
  });
});
