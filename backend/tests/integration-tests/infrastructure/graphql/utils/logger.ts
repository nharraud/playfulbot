import { vi } from 'vitest';

export function hideErrorLogs() {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
}