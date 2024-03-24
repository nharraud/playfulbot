import pino from 'pino';

const config: pino.LoggerOptions = {};
if (process.env.NODE_ENV === 'development') {
  config.transport = {
    target: 'pino-pretty',
  };
}

const logger = pino(config);

export default logger;
