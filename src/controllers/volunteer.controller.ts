import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';
import { IAnnouncement, IPasswordResetCode, IToken, IVerificationCode } from '../user';

import ApiError from '../ApiError';
import constants from '../constants/constants';
import * as utils from '../utils';
import { Volunteer } from '../volunteer';

/**
 * Validates that the user creation details are all there and contain all the correct information
 * including password length, username length, email type etc
 */
export function validateVolunteerCreationDetails(req: Request, res: Response, next: NextFunction) {
  const volunteerRequirements: string[] = ['username', 'password', 'name', 'email', 'data_entry_user_id'];
  const volunteer = _.pick(req.body.volunteer, volunteerRequirements);

  if (_.isNil(volunteer) || !_.isObject(volunteer)) {
    return res.status(400).send({ error: 'volunteer Validation', description: constants.INVALID_VOLUNTEER_FORMAT });
  }

  _.forEach(volunteerRequirements, (requirement: string) => {
    if (!volunteer[requirement] && !res.headersSent) {
      return res.status(400).send({
        description: constants.VOLUNTEER_REQUIREMENT_NEEDED(requirement),
        error: 'Invalid Credentials',
      });
    }

    if (requirement !== 'data_entry_user_id' && !_.isString(volunteer[requirement]) && !res.headersSent) {
      return res.status(400).send({
        description: constants.VOLUNTEER_REQUIREMENT_STRING(requirement),
        error: 'Invalid Credentials Formatting',
      });
    }
    return 1;
  });

  if (res.headersSent) {
    return 1;
  }

  const re: RegExp = new RegExp('^[a-zA-Z0-9]+$');
  const reName: RegExp = new RegExp('^[a-zA-Z- ]+$');
  const reEmail: RegExp = new RegExp('^[a-zA-Z0-9@._-]+$');

  const userLen: number = volunteer.username.length;
  const passwordLen: number = volunteer.password.length;
  const emailLen: number = volunteer.email.length;
  const nameLen: number = volunteer.name.length;

  if (constants.PASSWORD_MIN_LENGTH > passwordLen || passwordLen > constants.PASSWORD_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_PASSWORD_LENGTH_ALL });
  }

  if (constants.USERNAME_MIN_LENGTH > userLen || userLen > constants.USERNAME_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_LENGTH_ALL });
  }

  if (constants.EMAIL_BODY_MIN_LENGTH > emailLen || emailLen > constants.EMAIL_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_EMAIL_LENGTH_ALL });
  }

  if (constants.NAME_MIN_LENGTH > nameLen || nameLen > constants.NAME_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_NAME_TYPE });
  }

  if (volunteer.email.indexOf('@') === -1) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_EMAIL_NO_TYPE });
  }

  if (!re.test(volunteer.username)) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_SYMBOLS });
  }

  if (!reEmail.test(volunteer.email)) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_EMAIL_SYMBOLS });
  }

  if (!reName.test(volunteer.name)) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_NAME_SYMBOLS });
  }

  volunteer.email = volunteer.email.toLowerCase();
  req.body.volunteer = volunteer;
  return next();
}

/**
 * Validates that the user exists and that the email and username was passed.
 */
export async function validateRequestResetDetails(req: Request, res: Response, next: NextFunction) {
  const { username, email }: { username: string; email: string; } = req.params;

  if (_.isNil(username)) {
    res.status(400).send({ error: 'Username validation', description: constants.USERNAME_REQUIRED });
  } else if (_.isNil(email)) {
    res.status(400).send({ error: 'Email validation', description: constants.EMAIL_REQUIRED });
  } else {
    const volunteer = new Volunteer(null, username);

    try {
      await volunteer.existsByUsername();
      if (volunteer.email === email) {
        req.body.volunteer = volunteer;
        next();
      } else {
        res.status(400).send({ error: 'Email validation', description: constants.VOLUNTEER_EMAIL_MATCH });
      }
    } catch (error) {
      next(new ApiError(req, res, error, 400, 'User existence', constants.VOLUNTEER_EXISTS));
    }
  }
}

/**
 * Generates a random number and a salt, salts and hashes a number and stores that in the database
 * under the password reset table with the id of the user, the salt and hashed code and the salt
 * that was used to salt and hash the stored code for use when validating the requesting code.
 * Then calls next where the code will be used to generate a link to send to the client which
 * will allow them to to send a reset request with the code and there new password.
 */
export async function createPasswordResetCode(req: Request, res: Response, next: NextFunction) {
  const { volunteer }: { volunteer: Volunteer } = req.body;

  try {
    req.body.resetPasswordCode = await volunteer.createPasswordResetCode();
    next();
  } catch (error) {
    next(new ApiError(req, res, error, 400, 'Password reset code', constants.VOLUNTEER_RESET_CODE_FAIL));
  }
}

/**
 * Checks and validates that the password being updated via the update ore reset code meets all
 * requirements otherwise sends 400.
 */
export function validatePasswordDetails(req: Request, res: Response, next: NextFunction) {
  const { password, oldPassword }: { password: string; oldPassword: string; } = req.body;

  if (_.isNil(password) || _.isNil(oldPassword)) {
    res.status(400).send({ error: 'Param not provided', description: constants.VOLUNTEER_UPDATE_PASSWORD_REQUIRE });

  } else if (password.length < constants.PASSWORD_MIN_LENGTH || password.length > constants.PASSWORD_MAX_LENGTH
    || oldPassword.length < constants.PASSWORD_MIN_LENGTH || password.length > constants.PASSWORD_MAX_LENGTH) {
    res.status(400).send({ error: 'Invalid Credentials', description: constants.PASSWORD_MIN_LENGTH });
  } else {
    req.body.pasword = password;
    req.body.oldPassword = oldPassword;
    next();
  }
}

/**
 * Checks if the password (req.password) meets the required needs.
 */
export function validatePasswordDetail(req: Request, res: Response, next: NextFunction) {
  const { password }: { password: string; } = req.body;

  if (_.isNil(password)) {
    res.status(400).send({ error: 'Param not provided', description: constants.PASSWORD_REQUIRED });
  } else if (password.length < 6) {
    res.status(400).send({ error: 'Invalid Credentials', description: constants.PASSWORD_MIN_LENGTH });
  } else {
    next();
  }
}

/**
 * Validates that all the required parts for resetting a password is given.
 */
export function validatePasswordResetDetails(req: Request, res: Response, next: NextFunction) {
  const { username, password }: { username: string; password: string } = req.body;
  const resetCode: string = req.body.reset_code;

  if (_.isNil(resetCode)) {
    res.status(400).send({ error: 'Param not provided', description: constants.RESET_CODE_REQUIRED });
  } else if (_.isNil(username)) {
    res.status(400).send({ error: 'Param not provided', description: constants.USERNAME_REQUIRED });
  } else if (_.isNil(password)) {
    res.status(400).send({ error: 'Param not provided', description: constants.PASSWORD_REQUIRED });
  } else {
    req.body.resetCode = resetCode;
    req.body.username = username;
    req.body.password = password;
    next();
  }
}

/**
 * Pulls the code, salt, hashes the code emailed to the client with the stores salt then compares
 * the newly salted and hashed code with the already salted and hashed stored code to see if they
 * match and if they match call next, otherwise said a 401 invalid authentication. (meaning that
 * the code used into trying to verify the account was not the correct code).
 */
export async function validateVerifyCodeAuthenticity(req: Request, res: Response, next: NextFunction) {
  const { code, volunteer }: { code: string; volunteer: Volunteer} = req.body;

  try {
    const verificationCode: IVerificationCode | Error | any = await volunteer.getVerificationCode();

    const storedCode = verificationCode.code;
    const storedSalt = verificationCode.salt;
    const hashedCode = utils.saltAndHash(code, storedSalt);

    if (hashedCode.hashedPassword === storedCode) {
      next();
    } else {
      res.status(401).send({ error: 'Invalid Code', description: constants.VOLUNTEER_INVALID_VERIFICATION_CODE });
    }
  } catch (error) {
    next(new ApiError(req, res, error, 400, 'Verification', constants.VOLUNTEER_FAILED_GET_VERIFICATION_CODE(error)));
  }
}

/**
 * validates that the passed code matches up with the salt and hashed code in
 * the password_reset_code table
 */
export async function validatePasswordResetCodeAuthenticity(req: Request, res: Response, next: NextFunction) {
  const code: string = req.body.resetCode;
  const { volunteer }: { volunteer: Volunteer } = req.body;

  try {
    const passwordResetCode: IPasswordResetCode = await volunteer.getPasswordResetCode();
    const storedCode = passwordResetCode.code;
    const storedSalt = passwordResetCode.salt;
    const hashedCode = utils.saltAndHash(code, storedSalt);

    if (hashedCode.hashedPassword === storedCode) {
      await volunteer.removePasswordResetCode();
      next();
    }
  } catch (error) {
    next(new ApiError(req, res, error, 401, 'Invalid Password Code', constants.VOLUNTEER_INVALID_VERIFICATION_CODE));
  }
}

/**
 *  Checks to see if the notification id is passed properly and passes it on correctly.
 */
export function validateNotificationId(req: Request, res: Response, next: NextFunction) {
  const notificationId: number = req.body.notification_id;

  if (_.isNil(notificationId) || !_.isNumber(notificationId)) {
    res.status(400).send({ error: 'Invalid Notification Id', description: constants.NOTIFICATION_ID_REQUIRED });
  } else {
    req.body.notificationId = notificationId;
    next();
  }
}

/**
 * Updates the volunteers password with the new password by the
 * users id and then tells the client that there password has been updated.
 */
export async function updateUsersPassword(req: Request, res: Response, next: NextFunction) {
  const { volunteer, password }: { volunteer: Volunteer; password: string; } = req.body;
  const { username }: { username: string; } = volunteer;

  try {
    await volunteer.updatePassword(password);
    res.status(200).send({ message: `Volunteer ${username} password updated` });
  } catch (error) {
    next(
      new ApiError(
        req, res, error, 500, 'Password updating',
        constants.VOLUNTEER_FAILED_UPDATE_PASSWORD(username, error),
      ));
  }
}

/**
 * Marks the account in the database as a verified account, allowing the user to login after the
 * set time period.
 */
export async function verifyVolunteerAccount(req: Request, res: Response, next: NextFunction) {
  const { username, volunteer }: { username: string; volunteer: Volunteer; } = req.body;

  try {
    await volunteer.removeVerificationCode();
    await volunteer.verifyVolunteer();
    res.status(200).send({ message: `Volunteer ${username} email is now verified` });
  } catch (error) {
    const errorMessage = `Failed to mark account ${username} as verified, error=${JSON.stringify(error)}`;
    const formattedError = Object.assign(error, { message: errorMessage });

    next(new ApiError(req, res, formattedError, 500, 'Failed Verifying', constants.VOLUNTEER_VERIFY_MARK_FAIL(username)));
  }
}

/**
 * Checks to see that the validation code already exists in the verification table and calls next
 * otherwise sends a bad request.
 */
export async function validateVerifyCodeExists(req: Request, res: Response, next: NextFunction) {
  const { code, username, id: userId }: { code: string; username: string; id: number; } = req.body;

  if (_.isNil(code) || _.isNil(userId)) {
    res.status(500).send({ error: 'Validate Verify Code', description: constants.VERIFICATION_CODE_REQUIRED });
  }

  req.body.code = code;

  const volunteer = new Volunteer(userId, username);
  req.body.volunteer = volunteer;

  try {
    await volunteer.existsById();
    await volunteer.doesVerificationCodeExist();
    next();
  } catch (error) {
    next(new ApiError(req, res, error, 400, 'Code existence', constants.VOLUNTEER_VERIFICATION_CODE_DOES_NOT_EXIST));
  }
}

/**
 * Checks that the given code matches the code (if any) in the password_reset_code table
 */
export async function validateResetCodeExists(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string; } = req.body;

  const volunteer = new Volunteer(null, username);
  req.body.volunteer = volunteer;

  try {
    await volunteer.existsByUsername();
    await volunteer.doesPasswordResetCodeExist();
    next();
  } catch (error) {
    next(new ApiError(req, res, error, 400, 'Code existence', constants.VOLUNTEER_VERIFICATION_CODE_DOES_NOT_EXIST));
  }
}

/**
 * Creates a new Volunteer within the database.
 */
export async function createNewVolunteer(req: Request, res: Response, next: NextFunction) {
  const vol: { username: string; name: string; email: string, password: string; } = req.body.volunteer;

  const volunteer = new Volunteer(null, vol.username);

  volunteer.name = vol.name;
  volunteer.email = vol.email;

  try {
    req.body.verificationCode = await volunteer.createVolunteer(vol.password);
    next();
  } catch (error) {
    const description = constants.VOLUNTEER_CREATE_FAIL(volunteer.username, error.message);
    next(new ApiError(req, res, error, 500, 'Volunteer Creation', description));
  }
}

/**
 * Gets all active notifications for the requesting user, requires authentication token.
 */
export async function gatherActiveNotifications(req: Request, res: Response, next: NextFunction) {
  const decodedToken: IToken = req.body.decoded;

  const { username } = decodedToken;
  const userId = decodedToken.id;

  const volunteer = new Volunteer(userId, username);

  try {
    await volunteer.existsById();
    const notifications: IAnnouncement[] | Error = await volunteer.getActiveNotifications();
    res.status(200).send({ message: 'Notifications', content: { notifications } });
  } catch (error) {
    const description = constants.VOLUNTEER_GET_NOTIFICATION_FAIL(volunteer.username, error);
    next(new ApiError(req, res, error, 500, 'Notifications error', description));
  }
}

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
  const decodedToken: IToken = req.body.decoded;

  const { notificationId }: { notificationId: number; } = req.body;
  const { username }: { username: string; } = decodedToken;
  const userId = decodedToken.id;

  const volunteer = new Volunteer(userId, username);

  try {
    await volunteer.existsById();
    await volunteer.dismissNotification(notificationId);
    res.sendStatus(200);
  } catch (error) {
    const description = constants.VOLUNTEER_DISMISS_NOTIFICATION_FAIL(notificationId, error);
    next(new ApiError(req, res, error, 500, 'Notification dismissing', description));
  }
}

export async function gatherVolunteerProfile(req: Request, res: Response) {
  const decodedToken: IToken = req.body.decoded;

  const { username }: { username: string; } = decodedToken;
  const userId: number = decodedToken.id;

  const volunteer = new Volunteer(userId, username);

  try {
    await volunteer.existsById();
    res.status(200).send({ message: 'Volunteer Profile', content: { volunteer: volunteer.getProfile() } });
  } catch (error) {
    res.status(500).send({ error: 'User existing', description: constants.UNKNOWN_ERROR });
  }
}
