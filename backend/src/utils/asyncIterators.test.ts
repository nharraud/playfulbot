import { mergeListAndIterator } from './asyncIterators';

describe('Function "mergeListAndIterator"', () => {
  test('should add listed values', async () => {
    const firstValues = [1, 2, 3];

    // eslint-disable-next-line @typescript-eslint/require-await
    async function* generateValues() {
      yield 4;
      yield 5;
    }
    const merged = mergeListAndIterator(firstValues, generateValues());
    const result: Array<number> = [];

    for await (const actual of merged) {
      result.push(actual);
    }

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});
