import { NextFunction, Request, RequestHandler, Response } from 'express';
import { logger } from '../logger';

/**
 * Middleware that will catch all express routing and error calls, logging them and passing them
 * onto the next error. This is called with app.use in the main index.js file.
 */
function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err.stack);
  next(err);
}

export {
  logErrors,
};
