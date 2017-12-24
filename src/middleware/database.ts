import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import Configuration from '../components/Configuration/Configuration';
import constants from '../components/constants';
import Database from '../components/Database';

const config = new Configuration('mercury', 'mercury.json');
const databaseWrapper = new Database(config.getKey('database'));
databaseWrapper.connect();

/**
 * Gets the current online status of the database wrapper, if online calls next otherwise sends
 * a internal server error to the client.
 */
function validateConnectionStatus(req: Request, res: Response, next: NextFunction) {
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
function validateUsernameDoesNotExist(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string; } = req.body.volunteer;

  if (_.isNil(username)) {
    res.status(403).send({ error: 'Username required', description: constants.USERNAME_REQUIRED });
  } else {
    databaseWrapper.doesUsernameExist(username)
      .then(() => res.status(403).send({ error: 'Username exists', description: constants.USERNAME_ALREADY_EXISTS(username) }))
      .catch(() => next());
  }
}

/**
 * Checks with the database to see if the email already exists and throws a bad request otherwise
 * calls next.
 */
function validateEmailDoesNotExist(req: Request, res: Response, next: NextFunction) {
  const { email }: { email: string } = req.body.volunteer;

  databaseWrapper.doesEmailExist(email)
    .then(() => res.status(403).send({ error: 'Email exists', description: constants.EMAIL_ALREADY_EXISTS(email) }))
    .catch(() => next());
}

/**
 * Checks with the database to see if the username already exists and calls next otherwise
 * throws a bad request otherwise.
 */
function validateUsernameDoesExist(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string } = req.body;
  if (_.isNil(username)) {
    res.status(400).send({ error: 'Username validation', description: constants.USERNAME_REQUIRED });
  }

  if (!res.headersSent) {
    databaseWrapper.doesUsernameExist(username)
      .then((id: number) => {
        req.body.id = id;
        next();
      })
      .catch(() => res.status(400).send({ error: 'Username does not exists', description: constants.USERNAME_DOES_NOT_EXIST(username) }));
  }
}

/**
 * Checks with the database to see if the email already exists and calls next otherwise
 * throws a bad request.
 */
function validateEmailDoesExist(req: Request, res: Response, next: NextFunction) {
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

  if (!res.headersSent) {
    databaseWrapper.doesEmailExist(email)
      .then(() => next())
      .catch(() => res.status(400).send({ error: 'Email Does not exists', description: constants.EMAIL_DOES_NOT_EXIST(email) }));
  }
}

export {
  validateConnectionStatus,
  validateUsernameDoesNotExist,
  validateEmailDoesNotExist,
  validateUsernameDoesExist,
  validateEmailDoesExist,
};
