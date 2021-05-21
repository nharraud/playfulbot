export const resets = new Array<() => void>();

export function resetFixtures(): void {
  for (const reset of resets) {
    reset();
  }
  resets.splice(0, resets.length);
}

export function onResetFixtures(resetFn: () => void): void {
  resets.push(resetFn);
}
