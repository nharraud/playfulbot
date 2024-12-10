import pino, { Logger } from 'pino';
import pinoPretty from 'pino-pretty';

export function createLogger(): Logger {
  return pino({
    prettyPrint: {
      levelFirst: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prettifier: pinoPretty,
  });
}