/* eslint-disable @typescript-eslint/no-explicit-any */
import { $$asyncIterator } from 'iterall';

export type TransformFn<T> = (
  rootValue?: T,
  args?: any,
  context?: any,
  info?: any
) => T | Promise<T>;

export type ResolverFn<T> = (
  rootValue?: T,
  args?: any,
  context?: any,
  info?: any
) => AsyncIterator<T>;

interface IterallAsyncIterator<T> extends AsyncIterator<T> {
  [$$asyncIterator](): IterallAsyncIterator<T>;
}

/**
 * Transform payloads before sending them.
 * @param asyncIteratorFn subscription's pubsub iterator function.
 * @param transformFn Function transformign the payload.
 */
export function withTransform<T>(
  asyncIteratorFn: ResolverFn<T>,
  transformFn: TransformFn<T>
): ResolverFn<T> {
  return (rootValue: any, args: any, context: any, info: any): IterallAsyncIterator<any> => {
    const asyncIterator = asyncIteratorFn(rootValue, args, context, info);

    const getNextPromise = async () => {
      const payload = await asyncIterator.next();
      if (payload.done === true) {
        return payload;
      }
      const newValue = await Promise.resolve(transformFn(payload.value, args, context, info));
      return {
        value: newValue,
        done: payload.done,
      };
    };

    return {
      next(): any {
        return getNextPromise() as unknown;
      },
      return() {
        return asyncIterator.return();
      },
      throw(error) {
        return asyncIterator.throw(error);
      },
      [$$asyncIterator]() {
        return this;
      },
    };
  };
}
