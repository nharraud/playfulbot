/* eslint-disable @typescript-eslint/no-misused-promises */
import { PubSub } from './PubSub';

describe('PubSub', () => {
  test('should return no value when there are no listeners', async () => {
    const pubSub = new PubSub();
    const gameID = '1234';
    const data = { patch: { foo: 1 }, gameID, version: 1 };
    pubSub.publish('GAME_CHANGED', gameID, data);

    const listener = pubSub.listen('GAME_CHANGED', gameID);

    setTimeout(() => listener.return(), 200);
    const result = await listener.next();
    expect(result).toMatchObject({ done: true, value: undefined });
  });

  test('should return published messages when there are listeners', async () => {
    const pubSub = new PubSub();
    const gameID = '1234';
    const data = new Array(5).fill(0).map((_, index) => ({
      patch: { foo: index },
      gameID,
      version: index,
    }));

    const listener = pubSub.listen('GAME_CHANGED', gameID);
    data.forEach((message) => pubSub.publish('GAME_CHANGED', gameID, message));

    for (const message of data) {
      const result = await listener.next();
      expect(result).toMatchObject({ done: false, value: message });
    }
    setTimeout(() => listener.return(), 100);
    const result2 = await listener.next();
    expect(result2).toMatchObject({ done: true, value: undefined });
  });

  test('listener.return() should unsubscribe', async () => {
    const pubSub = new PubSub();
    const gameID = '1234';

    expect(pubSub.hasListeners('GAME_CHANGED', gameID)).toBeFalsy();
    const listener = pubSub.listen('GAME_CHANGED', gameID);
    expect(pubSub.hasListeners('GAME_CHANGED', gameID)).toBeTruthy();
    await listener.return();
    expect(pubSub.hasListeners('GAME_CHANGED', gameID)).toBeFalsy();
  });

  test('should return clear listeners on complete', async () => {
    const pubSub = new PubSub();

    const gameID = '1234';

    const listener = pubSub.listen('GAME_CHANGED', gameID);
    pubSub.complete('GAME_CHANGED', gameID);
    expect(pubSub.hasListeners('GAME_CHANGED', gameID)).toBeFalsy();
    const result = await listener.next();
    expect(result).toMatchObject({ done: true, value: undefined });
  });
});
