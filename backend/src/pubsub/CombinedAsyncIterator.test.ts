// import { describe } from 'vitest';
// import { DeferredPromise } from '~playfulbot/utils/DeferredPromise';
// import { CombinedAsyncIterator } from './CombinedAsyncIterator';

// async function* enumerate<T>(
//   keys: T[],
//   startPromise: Promise<unknown> = undefined,
//   endPromise: DeferredPromise<void> = undefined
// ) {
//   if (startPromise !== undefined) {
//     await startPromise;
//   }
//   for (const key of keys) {
//     yield key;
//   }
//   if (endPromise) {
//     endPromise.resolve();
//   }
// }

describe.skip('VersionedAsyncIterator', () => {
//   test('should return every value of each iterator', async () => {
//     // Start returing values from enumNumber when enumString is done.
//     const stringThenNumber = new DeferredPromise<void>();
//     // Start returing values from enumBool when enumNumber is done.
//     const numberThenBool = new DeferredPromise<void>();
//     const enumString = enumerate(['a', 'b', 'c'], undefined, stringThenNumber);
//     const enumNumber = enumerate([0, 1, 2], stringThenNumber.promise, numberThenBool);
//     const enumBool = enumerate([true, false], numberThenBool.promise);

//     const combined = new CombinedAsyncIterator([enumNumber, enumString, enumBool]);
//     const resultNumber = [];
//     const resultString = [];
//     const resultBool = [];
//     for await (const value of combined) {
//       if (typeof value === 'string') {
//         resultString.push(value);
//       }
//       if (typeof value === 'number') {
//         resultNumber.push(value);
//       }
//       if (typeof value === 'boolean') {
//         resultBool.push(value);
//       }
//     }
//     expect(resultString).toEqual(['a', 'b', 'c']);
//     expect(resultNumber).toEqual([0, 1, 2]);
//     expect(resultBool).toEqual([true, false]);
//   });

//   test('should be done as soon as one iterator is done when doneWhenFirstIteratorDone is "true"', async () => {
//     // Start returing values from enumNumber and enumBool when enumString is done.
//     const stringThenOthers = new DeferredPromise<void>();
//     const enumString = enumerate(['a', 'b', 'c'], undefined, stringThenOthers);
//     const enumNumber = enumerate([0, 1, 2], stringThenOthers.promise);
//     const enumBool = enumerate([true, false], stringThenOthers.promise);

//     const combined = new CombinedAsyncIterator([enumNumber, enumString, enumBool], true);
//     const resultNumber = [];
//     const resultString = [];
//     const resultBool = [];
//     for await (const value of combined) {
//       if (typeof value === 'string') {
//         resultString.push(value);
//       }
//       if (typeof value === 'number') {
//         resultNumber.push(value);
//       }
//       if (typeof value === 'boolean') {
//         resultBool.push(value);
//       }
//     }
//     expect(resultString).toEqual(['a', 'b', 'c']);
//     expect(resultNumber).toEqual([]);
//     expect(resultBool).toEqual([]);
//   });

//   test('should call "return" on non-done iterators when doneWhenFirstIteratorDone is "true"', async () => {
//     // Start returing values from enumNumber and enumBool when enumString is done.
//     const stringThenOthers = new DeferredPromise<void>();
//     const enumString = enumerate(['a', 'b', 'c'], undefined, stringThenOthers);
//     const enumNumber = enumerate([0, 1, 2], stringThenOthers.promise);
//     const enumBool = enumerate([true, false], stringThenOthers.promise);

//     const stringReturn = jest.spyOn(enumString, 'return');
//     const numberReturn = jest.spyOn(enumNumber, 'return');
//     const boolReturn = jest.spyOn(enumNumber, 'return');

//     const combined = new CombinedAsyncIterator([enumNumber, enumString, enumBool], true);
//     // eslint-disable-next-line no-empty
//     for await (const value of combined) {
//     }

//     expect(stringReturn).toBeCalledTimes(0);
//     expect(numberReturn).toBeCalledTimes(1);
//     expect(boolReturn).toBeCalledTimes(1);
//   });
});
