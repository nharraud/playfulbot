import pino from 'pino';
import pinoPretty from 'pino-pretty';

const logger = pino({
  prettyPrint: {
    levelFirst: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  prettifier: pinoPretty,
});

export default logger;
