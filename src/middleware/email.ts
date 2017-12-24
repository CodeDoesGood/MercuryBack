import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import Configuration from '../components/Configuration/Configuration';
import constants from '../components/constants';
import Email from '../components/Email';
import { logger } from '../components/Logger';
import Volunteer from '../components/Volunteer';

const config = new Configuration('mercury', 'mercury.json');
const emailClient = new Email(config.getKey('email'));

/**
 * Get the resend details from the get params of the request
 */
function getResendVerifyDetails(req: Request, res: Response, next: NextFunction) {
  const { username }: { username: string; } = req.params;
  req.body.username = username;
  next();
}

/**
 * This will Validate that the email service is currently up and running and call next otherwise
 * send a 500 internal server that the service is currently not working but they can still login
 * and a validation email will be sent out as soon as the service is running again.
 */
function validateConnectionStatus(req: Request, res: Response, next: NextFunction) {
  if (emailClient.getStatus()) {
    next();
  } else {
    res.status(503).send({ error: 'Email Service', description: constants.EMAIL_UNAVAILABLE });
  }
}

/**
 * Will send a validation email to the new volunteer via there email, allowing them
 * to confirm there current email address.
 */
function sendVerificationEmail(req: Request, res: Response) {
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

  const to: string = req.body.volunteer.email;
  const from: string = config.getKey('email').email;
  const subject: string = '[CodeDoesGood] Verification Email';
  const text: string = verificationLink;

  return emailClient.send(from, to, subject, text, text)
    .then(() => res.status(200).send({ message: `Account ${volunteer.username} created, you will soon get a verification email` }))
    .catch((error: Error) => {
      logger.error(`Error attempting to send a email. to=${to} from=${from}, error=${error}`);
      return res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
    });
}

/**
 * Will resend a validation email to the new volunteer via there email, allowing them
 * to confirm there current email address.
 */
function resendVerificationEmail(req: Request, res: Response) {
  const { volunteer }: { volunteer: Volunteer } = req.body;
  const code: string = req.body.verificationCode;
  let verificationLink: string;

  if (config.getKey('online')) {
    verificationLink = `${config.getKey('online_address')}/verify/${volunteer.username}/${code}`;
  } else {
    verificationLink = `http://localhost:8080/verify/${volunteer.username}/${code}`;
  }

  const to: string = req.body.volunteer.email;
  const from: string = config.getKey('email').email;
  const subject: string = '[CodeDoesGood] Resend-Verification Email';
  const text: string = verificationLink;

  if (!res.headersSent) {
    return emailClient.send(from, to, subject, text, text)
    .then(() => res.status(200).send({ message: `Resent new verification email for ${volunteer.username}` }))
    .catch((error: Error) => {
      logger.error(`Error attempting to send a email. to=${to} from=${from}, error=${error}`);
      return res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
    });
  }
}

/**
 * Resend the verification code to user,
 */
function createResendVerificationCode(req: Request, res: Response, next: NextFunction) {
  const volunteerId: number = req.body.id;
  const volunteer = new Volunteer(volunteerId);

  if (_.isNil(volunteerId)) {
    res.status(403).send({ error: 'Volunteer Id', description: constants.VOLUNTEER_ID_REQUIRED });
  } else {
    volunteer.exists()
    .then(() => {
      if (!volunteer.getVerification()) {
        return volunteer.createVerificationCode();
      }
      res.status(400).send({ error: 'verification exists', description: constants.VOLUNTEER_IS_VERIFIED(volunteer.username) });
    })
    .then((code: number) => {
      req.body.volunteer = volunteer;
      req.body.verificationCode = code;
      next();
    })
    .catch((error: Error) => res.status(500).send({
      description: constants.FAILED_VOLUNTEER_GET(error),
      error:'Authentication',
    }));
  }
}

/**
 * Generates and emails a link to the user for resetting the users password.
 * The front end will then route to a functional page that will post back
 * to reset the users password.
 */
function sendPasswordResetLinkToRequestingEmail(req: Request, res: Response) {
  const { volunteer } = req.body;
  const { username, email }: { username: string; email: string; } = volunteer;

  const code: number = req.body.resetPasswordCode;

  let link: string;

  if (config.getKey('online')) {
    link = `${config.getKey('online_address')}/reset/${username}/${code}`;
  } else {
    link = `http://localhost:8080/reset/${username}/${code}`;
  }

  const content: string = `A password reset has been requested for the Volunteer: ${username}. If you did not make this request you ` +
    `can safely ignore this email.\\n\\nIf you do actually want to reset your password, visit this link: ${link}`;

  logger.info(`Created password reset link for user=${username}, link=${link}`);

  const to: string = email;
  const from: string = config.getKey('email').email;
  const subject: string = '[CodeDoesGood] Password Reset Email';
  const text: string = content;

  emailClient.send(from, to, subject, text, text)
    .then(() => {
      res.status(200).send({ message: constants.EMAIL_RESET_SENT });
    })
    .catch((error: Error) => {
      logger.error(`Error attempting to send a email. to=${to} from=${from}, error=${error}`);
      res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
    });
}

/**
 * Validates the users name, email and text that as been sent.
 */
function validateContactUsRequestInformation(req: Request, res: Response, next: NextFunction) {
  const senderName: string = req.body.name;
  const senderEmail: string = req.body.email;
  const senderSubject: string = req.body.subject;
  const senderText: string = req.body.text;

  let valid: boolean = true;

  const sender: { name: string; email: string; subject: string; text: string; } = {
    email: senderEmail, name: senderName, subject: senderSubject, text: senderText,
  };

  _.forEach(sender, (item) => { if (_.isNil(item)) { valid = false; } });

  if (!valid) {
    return res.status(400).send({ error: 'Invalid fields', description: constants.EMAIL_FIELDS_REQUIRED });
  }

  if (sender.name.length > constants.EMAIL_MAX_LENGTH ||
    sender.email.length > constants.EMAIL_MAX_LENGTH ||
    sender.subject.length > constants.EMAIL_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid length', description: constants.EMAIL_AND_NAME_LENGTH });
  }

  if (sender.text.length > constants.EMAIL_BODY_MAX_LENGTH ||
    sender.text.length < constants.EMAIL_BODY_MIN_LENGTH) {
    return res.status(400).send({ error: 'Invalid length', description: constants.EMAIL_BODY_LENGTH });
  }

  // Bind the sender to the request data to be accessed later
  req.body.sender = sender;
  return next();
}

/**
 * Rejects any invalid domain names or banned domain names from being sent.
 */
function denyInvalidAndBlockedDomains(req: Request, res: Response, next: NextFunction) {
  return next();
}

/**
 * After validation of the name, email and senderText then send the email to the
 * email to the default CodeDoesGood inbox.
 */
function sendContactUsRequestInbox(req: Request, res: Response) {
  const { sender }: { sender: { name: string; email: string; subject: string; text: string; } } = req.body;

  emailClient.send(sender.email, config.getKey('email').email, sender.subject, sender.text, sender.text)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error: Error) => {
      logger.error(`Error attempting to send a email. to=${config.getKey('email').email} from=${sender.email}, error=${error}`);
      res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
    });
}

/**
 * Sends OK or Internal Server Error based on the true / false email status.
 */
function sendContactUsEmailStatus(req: Request, res: Response) {
  if (emailClient.getStatus()) {
    res.sendStatus(200);
  } else {
    res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
  }
}

export {
  createResendVerificationCode,
  denyInvalidAndBlockedDomains,
  getResendVerifyDetails,
  sendContactUsEmailStatus,
  resendVerificationEmail,
  sendContactUsRequestInbox,
  sendPasswordResetLinkToRequestingEmail,
  sendVerificationEmail,
  validateConnectionStatus,
  validateContactUsRequestInformation,
};
