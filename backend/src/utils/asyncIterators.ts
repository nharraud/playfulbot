/* eslint no-await-in-loop: "off" */

export async function* mergeListAndIterator<T>(
  firstValues: Array<T>,
  iterable: AsyncIterator<T, any, undefined>
): AsyncGenerator<T, any, undefined> {
  // Note that calling subscribeAll is required in order to make sure that the subscription is done before
  // we send the first elements. It is private so we need to cast the iterable.
  // See https://github.com/davidyaha/graphql-redis-subscriptions/blob/e2a165e8fbe26b4001443b2b52abfdd53d5f846c/src/pubsub-async-iterator.ts#L45.
  // FIXME: remove this call to a private method.
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
