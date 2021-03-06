import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import { Administrator } from '../administrator';
import { Configuration } from '../configuration';

import ApiError from '../ApiError';
import constants from '../constants/constants';
import * as utils from '../utils';
import { Volunteer } from '../volunteer';

const config = new Configuration();

interface IToken {
  username: string;
  id: number;
}

/**
 * Validates that the details provided are a valid type, format and content. If all true then next
 * will be called otherwise a bad request would be sent to the server.
 * @param {string} req.body.username The users username to be validate
 * @param {string} req.body.password  The old password of the user to validate
 */
export function validateAuthenticationDetails(req: Request, res: Response, next: NextFunction) {
  const { username, password }: { username: string; password: string; } = req.body;

  if (_.isNil(username)) {
    res.status(401).send({ error: 'Authentication', description: constants.USERNAME_REQUIRED });
  } else if (_.isNil(password)) {
    res.status(401).send({ error: 'Authentication', description: constants.PASSWORD_REQUIRED });
  } else if (username.length < constants.USERNAME_MIN_LENGTH) {
    res.status(401).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_CREDENTIALS_LENGTH });
  } else if (username.length > constants.USERNAME_MAX_LENGTH) {
    res.status(401).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_CREDENTIALS_LENGTH });
  } else if (password.length < constants.PASSWORD_MIN_LENGTH) {
    res.status(401).send({ error: 'Invalid Credentials', description: constants.INVALID_PASSWORD_CREDENTIALS_LENGTH });
  } else {
    req.body.username = username;
    req.body.password = password;
    next();
  }
}

/**
 * Authenticates but calls next if the user can authenticate by validating the salted password
 * with the passed password that would be salted and hashed before comparing. If the passwords
 * match up then it will call next, otherwise send a 401 back.
 *
 * This would be used when updating a existing password but not actually logging in.
 * @param {string} req.username The users username to be validate
 * @param {string} req.oldPassword  The old password of the user to validate
 */
export async function validateUserCredentials(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string } = req.body;

  const password: string = req.body.oldPassword;
  const volunteer = new Volunteer(null, username);

  try {
    await volunteer.existsByUsername();

    if (utils.compareAuthenticatingPassword(password, volunteer.salt, volunteer.password)) {
      req.body.volunteer = volunteer;
      next();
    } else {
      res.status(401).send({ error: 'Validate user credentials', description: constants.INCORRECT_PASSWORD });
    }
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Validate user credentials', constants.FAILED_VALIDATION));
  }
}

/**
 * Checks to see if the requesting user has a valid token
 * before continuing otherwise send a error back
 * @param {string} req.header('token') The token used for checking authentication
 */
export async function checkAuthenticationToken(req: Request, res: Response, next: NextFunction) {
  const secret: string = config.getKey('secret');
  const token: string = req.header('token');

  if (_.isNil(token) || !_.isString(token)) {
    res.status(401).send({ error: 'Invalid token', description: constants.INVALID_TOKEN });
  } else {
    try {
      req.body.decoded = await utils.validateAuthenticationToken(token, secret);
      next();
    } catch (error) {
      next(new ApiError(req, res, error, 500, 'Expired token', constants.NO_TOKEN_PASSED));
    }
  }
}

/**
 * Check to see if the authenticated user is currently a active admin.
 */
export async function checkAdminPortalAccess(req: Request, res: Response, next: NextFunction) {
  const { username } = req.body.decoded;
  const administrator = new Administrator(null, username);

  try {
    await administrator.existsByUsername();
    const canAccessAdminPortal: boolean | Error =  await administrator.canAccessAdminPortal();

    if (canAccessAdminPortal) {
      req.body.volunteer = administrator;
      return next();
    }
    res.status(401).send({ error: 'Unauthorized Access', description: constants.VOLUNTEER_NOT_AUTH });
  } catch (error) {
    next(new ApiError(req, res, error, 401, 'Unauthorized Access', constants.VOLUNTEER_NOT_AUTH));
  }
}

/**
 * Attempts to authenticate the user with the active directory
 * and binds them a token that will be used for all future
 * requests
 * @param {string} req.username The username of the user
 * @param {string} req.password The password of the user
 */
export async function authenticateLoggingInUser(req: Request, res: Response, next: NextFunction) {
  const { username, password }: { username: string; password: string } = req.body;
  const userId: number = req.body.id;

  const volunteer = new Volunteer(userId, username);

  try {
    await volunteer.existsById();
    if (!volunteer.getVerification()) {
      res.status(403).send({
        description: constants.VOLUNTEER_VERIFICATION_REQUIRED(volunteer.username),
        error: 'Failed verification check',
        failed_verify: true });
    } else {
      if (utils.compareAuthenticatingPassword(password, volunteer.salt, volunteer.password)) {
        const token: string = utils.signAuthenticationToken(username, userId, config.getKey('secret'));
        res.status(200).send({ message: `Volunteer ${username} authenticated`, content: { token, username, id: userId } });
      } else {
        res.status(401).send({ error: 'Validate user credentials', description: constants.INCORRECT_PASSWORD });
      }
    }
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Authentication', constants.FAILED_VOLUNTEER_GET(error)));
  }
}
