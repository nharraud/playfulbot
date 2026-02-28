export function isFailure<FailureType>(a: any): a is FailureType {
  return Boolean(a?.errors);
}