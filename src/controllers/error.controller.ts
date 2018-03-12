import { NextFunction, Request, Response } from 'express';
import ApiError from '../ApiError';

/**
 * Middleware that will catch all express routing and error calls, logging them and passing them
 * onto the next error. This is called with app.use in the main index.js file.
 */
function logErrors(err: ApiError, req: Request, res: Response, next: NextFunction) {
  err.sendJsonResponse();
}

export {
  logErrors,
};
