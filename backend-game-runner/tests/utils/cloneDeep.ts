import v8 from 'v8';

export function cloneDeep<T>(obj: T): T {
  return v8.deserialize(v8.serialize(obj)) as T;
}