const winston = require('winston');

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,
  },
};
const logger = new winston.Logger({
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      handleExceptions: false,
      json: false,
      colorize: true,
      level: 'debug',
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
