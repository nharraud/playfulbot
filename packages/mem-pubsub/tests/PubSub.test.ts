/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, test, expect } from 'vitest';
import { PubSub } from '../src/PubSub';

interface MyNumber {
  nb: number
}

interface MyString {
  str: string
}

type MyTypes = {
  MY_NUMBER: MyNumber
  MY_STRING: MyString
};

describe('PubSub', () => {
  test('should return no value when there are no listeners', async () => {
    const pubSub = new PubSub<MyTypes>();
    const subChannel = '1234';
    const data = { nb: 42 };
    pubSub.publish('MY_NUMBER', subChannel, data);

    const listener = pubSub.listen('MY_NUMBER', subChannel);

    setTimeout(() => listener.return(), 200);
    const result = await listener.next();
    expect(result).toMatchObject({ done: true, value: undefined });
  });

  test('should return published messages when there are listeners', async () => {
    const pubSub = new PubSub<MyTypes>();
    const subChannel = '1234';
    const data = new Array(5).fill(0).map((_, index) => ({
      nb: index
    }));

    const listener = pubSub.listen('MY_NUMBER', subChannel);
    data.forEach((message) => pubSub.publish('MY_NUMBER', subChannel, message));

    for (const message of data) {
      const result = await listener.next();
      expect(result).toMatchObject({ done: false, value: message });
    }
    setTimeout(() => listener.return(), 100);
    const result2 = await listener.next();
    expect(result2).toMatchObject({ done: true, value: undefined });
  });

  test('listener.return() should unsubscribe', async () => {
    const pubSub = new PubSub<MyTypes>();
    const subChannel = '1234';

    expect(pubSub.hasListeners('MY_NUMBER', subChannel)).toBeFalsy();
    const listener = pubSub.listen('MY_NUMBER', subChannel);
    expect(pubSub.hasListeners('MY_NUMBER', subChannel)).toBeTruthy();
    await listener.return();
    expect(pubSub.hasListeners('MY_NUMBER', subChannel)).toBeFalsy();
  });

  test('should return clear listeners on complete', async () => {
    const pubSub = new PubSub<MyTypes>();

    const subChannel = '1234';

    const listener = pubSub.listen('MY_STRING', subChannel);
    pubSub.complete('MY_STRING', subChannel);
    expect(pubSub.hasListeners('MY_STRING', subChannel)).toBeFalsy();
    const result = await listener.next();
    expect(result).toMatchObject({ done: true, value: undefined });
  });
});
