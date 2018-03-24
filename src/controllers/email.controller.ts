import * as fs from 'fs';
import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import ApiError from '../ApiError';
import { Configuration } from '../configuration';
import constants from '../constants/constants';
import { Email } from '../email';
import { EmailManager, IEmailContent } from '../emailManager';
import { logger } from '../logger';
import { Volunteer } from '../volunteer';

const config = new Configuration();
const emailManager = new EmailManager(config.getKey('email'));

const verified = async () => {
  try {
    await emailManager.verify();
    await emailManager.sendStoredEmails();
    logger.info(`[Email] Email Client is ready, service=${emailManager.getService()}, email=${emailManager.getUsername()}`);
  } catch (error) {
    logger.error(`[Email] Error creating email connection, error=${error}`);
  }
};

verified();

/**
 * Get the resend details from the get params of the request
 */
export function getResendVerifyDetails(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string } = req.params;
  req.body.username = username;
  next();
}

/**
 * This will Validate that the email service is currently up and running and call next otherwise
 * send a 500 internal server that the service is currently not working but they can still login
 * and a validation email will be sent out as soon as the service is running again.
 */
export function validateConnectionStatus(req: Request, res: Response, next: NextFunction) {
  const email: IEmailContent = req.body.email;

  if (emailManager.getEmailOnline()) {
    next();
  } else {
    emailManager.newStoredEmail(email);
    res.status(503).send({ error: 'Email Service', description: constants.EMAIL_UNAVAILABLE });
  }
}

/**
 * Will send a validation email to the new volunteer via there email, allowing them
 * to confirm there current email address.
 */
export function createVerificationEmail(req: Request, res: Response, next: NextFunction) {
  const { volunteer }: { volunteer: Volunteer } = req.body;
  const code: string = req.body.verificationCode;
  let verificationLink: string;

  if (_.isNil(code)) {
    return res.status(503).send({ error: 'Unavailable Service', description: constants.VERIFICATION_CODE_REQUIRED });
  }

  if (config.getKey('online')) {
    verificationLink = `${config.getKey('online_address')}/verify/${volunteer.username}/${code}`;
  } else {
    verificationLink = `http://localhost:8080/verify/${volunteer.username}/${code}`;
  }

  const email = new Email(volunteer.email, '[CodeDoesGood] Verification Email', verificationLink, verificationLink);
  const message: string = `Account ${volunteer.username} created, you will soon get a verification email`;

  req.body.email = email;
  req.body.message = message;
  next();
}

/**
 * Used to send a message based on the the email sent.
 *
 * @param req.body.email IEmailContent containing to, from, subject, text
 * @param req.body.message A string containing the message to be sent after the email has been sent
 */
export async function sendEmail(req: Request, res: Response) {
  const { email, message }: { email: Email; message: string } = req.body;

  try {
    await emailManager.send(email);
    res.status(200).send({ message });
  } catch (error) {
    logger.error(`Error attempting to send a email. to=${email.to}, error=${error}`);
    return res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
  }
}

/**
 * Will resend a validation email to the new volunteer via there email, allowing them
 * to confirm there current email address.
 */
export function createResendVerificationEmail(req: Request, res: Response, next: NextFunction) {
  const { volunteer, verificationCode }: { volunteer: Volunteer; verificationCode } = req.body;
  let verificationLink: string;

  if (config.getKey('online')) {
    verificationLink = `${config.getKey('online_address')}/verify/${volunteer.username}/${verificationCode}`;
  } else {
    verificationLink = `http://localhost:8080/verify/${volunteer.username}/${verificationCode}`;
  }

  const email = new Email(volunteer.email, '[CodeDoesGood] Resend-Verification Email', verificationLink, verificationLink);
  const message: string = `Resent new verification email for ${volunteer.username}`;

  req.body.email = email;
  req.body.message = message;
  next();
}

/**
 * Resend the verification code to user,
 */
export async function createResendVerificationCode(req: Request, res: Response, next: NextFunction) {
  const userId: number = req.body.id;
  const volunteer = new Volunteer(userId);

  if (_.isNil(userId)) {
    return res.status(403).send({ error: 'Volunteer Id', description: constants.VOLUNTEER_ID_REQUIRED });
  }

  try {
    await volunteer.existsById();

    if (!volunteer.getVerification()) {
      const code: number | Error = await volunteer.createVerificationCode();
      req.body.volunteer = volunteer;
      req.body.verificationCode = code;
      next();
    } else {
      res.status(400).send({ error: 'verification exists', description: constants.VOLUNTEER_IS_VERIFIED(volunteer.username) });
    }
  } catch (error) {
    res.status(500).send({ error: 'Authentication', description: constants.FAILED_VOLUNTEER_GET(error) });
  }
}

/**
 * Generates and emails a link to the user for resetting the users password.
 * The front end will then route to a functional page that will post back
 * to reset the users password.
 */
export function createPasswordResetLinkToRequestingEmail(req: Request, res: Response, next: NextFunction) {
  const { volunteer, resetPasswordCode } = req.body;
  let link: string;

  if (config.getKey('online')) {
    link = `${config.getKey('online_address')}/reset/${volunteer.username}/${resetPasswordCode}`;
  } else {
    link = `http://localhost:8080/reset/${volunteer.username}/${resetPasswordCode}`;
  }

  const content: string =
    `A password reset has been requested for the Volunteer: ${volunteer.username}. If you did not make this request you ` +
    `can safely ignore this email.\\n\\nIf you do actually want to reset your password, visit this link: ${link}`;

  const email = new Email(volunteer.email, '[CodeDoesGood] Password Reset Email', content, content);
  const message = constants.EMAIL_RESET_SENT;

  req.body.email = email;
  req.body.message = message;
  next();
}

/**
 * Validates the users name, email and text that as been sent.
 */
export function validateContactUsRequestInformation(req: Request, res: Response, next: NextFunction) {
  const senderName: string = req.body.name;
  const senderEmail: string = req.body.email;
  const senderSubject: string = req.body.subject;
  const senderText: string = req.body.text;

  let valid: boolean = true;

  const sender: { name: string; email: string; subject: string; text: string } = {
    email: senderEmail,
    name: senderName,
    subject: senderSubject,
    text: senderText,
  };

  _.forEach(sender, (item) => {
    if (_.isNil(item)) {
      valid = false;
    }
  });

  if (!valid) {
    return res.status(400).send({ error: 'Invalid fields', description: constants.EMAIL_FIELDS_REQUIRED });
  }

  if (
    sender.name.length > constants.EMAIL_MAX_LENGTH ||
    sender.email.length > constants.EMAIL_MAX_LENGTH ||
    sender.subject.length > constants.EMAIL_MAX_LENGTH
  ) {
    return res.status(400).send({ error: 'Invalid length', description: constants.EMAIL_AND_NAME_LENGTH });
  }

  if (sender.text.length > constants.EMAIL_BODY_MAX_LENGTH || sender.text.length < constants.EMAIL_BODY_MIN_LENGTH) {
    return res.status(400).send({ error: 'Invalid length', description: constants.EMAIL_BODY_LENGTH });
  }

  // Bind the sender to the request data to be accessed later
  req.body.sender = sender;
  return next();
}

/**
 * Rejects any invalid domain names or banned domain names from being sent.
 */
export function denyInvalidAndBlockedDomains(req: Request, res: Response, next: NextFunction) {
  return next();
}

/**
 * After validation of the name, email and senderText then send the email to the
 * email to the default CodeDoesGood inbox.
 */
export async function sendContactUsRequestInbox(req: Request, res: Response, next: NextFunction) {
  const { sender }: { sender: { name: string; email: string; subject: string; text: string } } = req.body;

  try {
    const email = new Email(sender.email, sender.subject, sender.text, sender.text);
    await emailManager.send(email);
    res.sendStatus(200);
  } catch (error) {
    const errorMessage = `Error sending email. to=${config.getKey('email').email} from=${sender.email}, error=${error.message}`;
    const formattedError = Object.assign(error, { message: errorMessage });
    next(new ApiError(req, res, formattedError, 503, 'Unavailable Service', constants.EMAIL_UNAVAILABLE));
  }
}

/**
 * Sends OK or Internal Server Error based on the true / false email status.
 */
export function sendContactUsEmailStatus(req: Request, res: Response) {
  if (emailManager.getEmailOnline()) {
    res.sendStatus(200);
  } else {
    res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
  }
}

/**
 * Attempt to re-verify the service for the email client and bring it back online.
 */
export async function reverifyTheService(req: Request, res: Response, next: NextFunction) {
  try {
    await emailManager.verify();
    res.status(200).send({ message: 'Email service restarted successfully' });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Email service', constants.EMAIL_VERIFY_FAILED(error)));
  }
}

/**
 * Attempts to send the stored late emails to the volunteer
 */
export async function sendStoredLateEmails(req: Request, res: Response, next: NextFunction) {
  try {
    const failedStored: IEmailContent[] = await emailManager.sendStoredEmails();
    res.status(200).send({ message: 'Sent stored emails, returned emails that failed to send', content: failedStored });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Stored Emails', constants.EMAIL_FAILED_SEND_STORED(error)));
  }
}

/**
 * Sends stored emails to requesting client
 */
export async function retrieveStoredLateEmails(req: Request, res: Response, next: NextFunction) {
  try {
    const emails: IEmailContent[] = await emailManager.getStoredEmails();
    res.status(200).send({ message: 'stored late emails', content: { emails } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Stored emails', 'Failed to get stored emails'));
  }
}

/**
 * Removes a stored late email by the index provided
 */
export async function removeStoredEmailByIndex(req: Request, res: Response, next: NextFunction) {
  if (_.isNil(req.params.email_id)) {
    return res.status(401).send({ error: 'Email Id', description: constants.STORED_EMAIL_MISSING_INDEX });
  }

  const emailIndex = parseInt(req.params.email_id, 10);

  try {
    const updatedEmails: number = await emailManager.removeStoredEmailByIndex(emailIndex);
    const message = `Removed stored email ${emailIndex}`;

    res.status(200).send({ message, content: { email_removed: emailIndex } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Remove late Emails', error.message));
  }
}

/**
 * Updates a late stored email by index, requires the full email to be sent down.
 */
export async function updateStoredEmailByIndex(req: Request, res: Response, next: NextFunction) {
  if (_.isNil(req.params.email_id)) {
    return res.status(401).send({ error: 'Email Id', description: constants.STORED_EMAIL_MISSING_INDEX });
  }

  const emailIndex = parseInt(req.params.email_id, 10);
  const email: IEmailContent = req.body.email;

  if (_.isNil(email)) {
    return res.status(401).send({ error: 'Email Id', description: constants.STORED_EMAIL_UPDATE_REQUIRED });
  }

  if (_.isNil(email.html) || _.isNil(email.subject) || _.isNil(email.text) || _.isNil(email.to)) {
    return res.status(401).send({ error: 'Email Id', description: constants.STORED_EMAIL_REQUIREMENTS });
  }

  try {
    const updatedEmails: number = await emailManager.updateStoredEmailByIndex(emailIndex, email);
    const message: string = `Updated stored email ${emailIndex}`;

    res.status(200).send({ message, content: { email_updated: emailIndex, updated: updatedEmails } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'RUpdate late email', error.message));
  }
}

/**
 * Sends the emailManager service details to the requesting administrator
 * with the password redacted.
 */
export function sendAdminServiceDetails(req: Request, res: Response) {
  res.status(200).send({ message: 'Email Service Details', content: { service: emailManager.getServiceConfig() } });
}

export function validateUpdatedServiceDetails(req: Request, res: Response, next: NextFunction) {
  const requiredObjects: string[] = ['user', 'service', 'secure'];

  if (_.isNil(req.body.service)) {
    return res.status(500).send({ error: 'Service update', description: constants.EMAIL_SERVICE_OBJECT_REQUIRED });
  }

  const service = _.pick(req.body.service, requiredObjects);

  if (_.isNil(service.user) || _.isNil(service.service) || _.isNil(service.secure)) {
    return res.status(500).send({ error: 'Service update', description: constants.EMAIL_SERVICE_REQUIRES_USER });
  }

  req.body.service = service;
  next();
}

/**
 * Updates the service details on the config file and on the email client
 * triggering a restart / re-verify of the service.
 */
export async function updateServiceDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const updatedServices = req.body.service;
    await emailManager.updateServiceDetails(updatedServices, config.getKey('email').password);

    const storedConfig = config.getConfiguration();
    storedConfig.email.email = updatedServices.user;
    storedConfig.email.service = updatedServices.service;
    config.update(storedConfig);

    logger.info('[Email] the email service details have been updated and restarted');

    res.status(200).send({ message: 'Updated services and restarted', content: { updated: updatedServices } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Email Service', constants.EMAIL_VERIFY_FAILED(error)));
  }
}

export async function updateServicePassword(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password;

  if (_.isNil(password)) {
    return res.status(500).send({ error: 'Service password update', description: constants.EMAIL_UPDATE_PASSWORD_REQUIRES_PASSWORD });
  }

  try {
    await emailManager.updateServicePassword(password);
    const storedConfig = config.getConfiguration();
    storedConfig.email.password = password;
    config.update(storedConfig);

    logger.info('[Email] The email service password has been updated and restarted');
    res.status(200).send({ message: 'Updated service password' });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Email Service', constants.EMAIL_VERIFY_FAILED(error)));
  }
}
