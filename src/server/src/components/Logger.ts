import * as winston from 'winston';

const logLevels = {
  levels: {
    debug: 4,
    error: 0,
    info: 2,
    silly: 5,
    verbose: 3,
    warn: 1,
  },
};
export const logger = new winston.Logger({
  exitOnError: false,
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      colorize: true,
      handleExceptions: false,
      json: false,
      level: 'debug',
    }),
  ],
});
