const logger = require('../components/Logger/Logger');

/**
 * Middleware that will catch all express routing and error calls, logging them and passing them
 * onto the next error. This is called with app.use in the main index.js file.
 */
function logErrors(err, req, res, next) {
  logger.error(err.stack);
  next(err);
}

module.exports = {
  logErrors,
};

