import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import ApiError from '../ApiError';
import { Configuration } from '../configuration';
import constants from '../constants/constants';
import { Database } from '../database';

const config = new Configuration();
const databaseWrapper = new Database(config.getKey('database'));

/**
 * Gets the current online status of the database wrapper, if online calls next otherwise sends
 * a internal server error to the client.
 */
export function validateConnectionStatus(req: Request, res: Response, next: NextFunction) {
  if (databaseWrapper.getOnlineStatus()) {
    next();
  } else {
    res.status(503).send({ error: 'Database Connection', description: constants.DATABASE_UNAVAILABLE });
  }
}

/**
 * Checks with the database to see if the username already exists and throws a bad request otherwise
 * calls next.
 * @param {string} req.volunteer.username The username of the volunteer
 */
export async function validateUsernameDoesNotExist(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string; } = req.body.volunteer;

  try {
    if (_.isNil(username)) {
      res.status(403).send({ error: 'Username required', description: constants.USERNAME_REQUIRED });
    } else {
      await databaseWrapper.doesUsernameExist(username);
      res.status(403).send({ error: 'Username exists', description: constants.USERNAME_ALREADY_EXISTS(username) });
    }
  } catch (error) {
    next();
  }
}

/**
 * Checks with the database to see if the email already exists and throws a bad request otherwise
 * calls next.
 */
export async function validateEmailDoesNotExist(req: Request, res: Response, next: NextFunction) {
  const { email }: { email: string } = req.body.volunteer;

  try {
    if (_.isNil(email)) {
      res.status(403).send({ error: 'Email required', description: constants.EMAIL_REQUIRED });
    } else {
      await databaseWrapper.doesEmailExist(email);
      res.status(403).send({ error: 'Email exists', description: constants.EMAIL_ALREADY_EXISTS(email) });
    }
  } catch (error) {
    next();
  }
}

/**
 * Checks with the database to see if the username already exists and calls next otherwise
 * throws a bad request otherwise.
 */
export async function validateUsernameDoesExist(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string } = req.body;
  if (_.isNil(username)) {
    res.status(400).send({ error: 'Username validation', description: constants.USERNAME_REQUIRED });
  }

  try {
    if (!res.headersSent) {
      req.body.id = await databaseWrapper.doesUsernameExist(username);
      next();
    }
  } catch (error) {
    res.status(400).send({ error: 'username', description: constants.USERNAME_DOES_NOT_EXIST(username) });
  }
}

/**
 * Checks with the database to see if the email already exists and calls next otherwise
 * throws a bad request.
 */
export async function validateEmailDoesExist(req: Request, res: Response, next: NextFunction) {
  const { email: email1 }: { email: string; } = req.params;
  const { email: email2 }: { email: string; } = req.body;

  let email: string;

  if (!_.isNil(email1)) {
    email = email1;
  } else if (!_.isNil(email2)) {
    email = email2;
  } else {
    res.status(400).send({ error: 'Email validation', description: constants.EMAIL_REQUIRED });
  }

  req.body.email = email;

  try {
    if (!res.headersSent) {
      req.body.id = await databaseWrapper.doesEmailExist(email);
      next();
    }
  } catch (error) {
    next(new ApiError(req, res, error, 400, 'Email existence', constants.EMAIL_DOES_NOT_EXIST(email)));
  }
}
