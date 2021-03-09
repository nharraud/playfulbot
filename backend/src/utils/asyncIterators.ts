/* eslint no-await-in-loop: "off" */

export async function* mergeListAndIterator<T>(
  firstValues: Array<T>,
  iterable: AsyncIterator<T, any, undefined>
): AsyncGenerator<T, any, undefined> {
  const p: Promise<unknown> = (iterable as any).subscribeAll() as Promise<unknown>;
  await p;
  yield* firstValues;
  let result = await iterable.next();
  while (!result.done) {
    if (result.done) {
      break;
    }
    yield result.value;
    result = await iterable.next();
  }
}
