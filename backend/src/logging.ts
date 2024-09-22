import pino from 'pino';
import pinoPretty from 'pino-pretty';

export function createLogger() {
  return pino({
    prettyPrint: {
      levelFirst: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prettifier: pinoPretty,
  });
}

/**
 * @deprecated logger should not be used
 */
export const logger = createLogger();
