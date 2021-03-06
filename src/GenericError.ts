import logger from './logger';

/**
 * A handler for promise errors, including logging
 */
export default class GenericError extends Error {
  constructor(error: Error) {
    super(error.message);
    logger.error(error.message);
  }
}
