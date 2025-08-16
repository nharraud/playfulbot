export function range(nonInclusiveEnd: number) {
  return [...Array(nonInclusiveEnd).keys()];
}