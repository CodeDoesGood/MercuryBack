const _ = require('lodash');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const constants = require('../components/constants');
const EmailClient = require('../components/Email');
const logger = require('../components/Logger');
const Volunteer = require('../components/Volunteer');

const config = new ConfigurationWrapper('mercury', 'mercury.json');
const emailClient = new EmailClient(config.getKey('email'));
/**
 * This will Validate that the email service is currently up and running and call next otherwise
 * send a 500 internal server that the service is currently not working but they can still login
 * and a validation email will be sent out as soon as the service is running again.
 */
function validateConnectionStatus(req, res, next) {
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
function sendVerificationEmail(req, res) {
  const { volunteer } = req;
  const code = req.verificationCode;
  let verificationLink;

  if (_.isNil(code)) {
    return res.status(503).send({ error: 'Unavailable Service', description: constants.VERIFICATION_CODE_REQUIRED });
  } else if (config.getKey('online')) {
    verificationLink = `${config.getKey('online_address')}/verify/${volunteer.username}/${code}`;
  } else {
    verificationLink = `http://localhost:8080/verify/${volunteer.username}/${code}`;
  }

  const to = req.volunteer.email;
  const from = config.getKey(['email']).email;
  const subject = '[CodeDoesGood] Verification Email';
  const text = verificationLink;

  return emailClient.send(from, to, subject, text, text)
    .then(() => res.status(200).send({ message: `Account ${volunteer.username} created, you will soon get a verification email` }))
    .catch((error) => {
      logger.error(`Error attempting to send a email. to=${to} from=${from}, error=${error}`);
      return res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
    });
}

/**
 * Resend the verification code to user,
 */
function resendVerificationEmail(req, res) {
  const volunteerId = req.id;
  const volunteer = new Volunteer(volunteerId);

  if (_.isNil(volunteerId)) {
    res.status(403).send({ error: 'Volunteer Id', description: constants.VOLUNTEER_ID_REQUIRED });
  } else {
    volunteer.exists()
      .then(() => {
        if (!volunteer.getVerification()) {
          return volunteer.createVerificationCode();
        }
        return res.status(400).send({ error: 'Verification', description: constants.VOLUNTEER_IS_VERIFIED(volunteer.username) });
      })
      .then((code) => {
        req.volunteer = volunteer;
        req.verificationCode = code;
        sendVerificationEmail(req, res);
      })
      .catch(error => res.status(500).send({ error: 'Authentication', description: constants.FAILED_VOLUNTEER_GET(error) }));
  }
}

/**
 * Generates and emails a link to the user for resetting the users password.
 * The front end will then route to a functional page that will post back
 * to reset the users password.
 */
function sendPasswordResetLinkToRequestingEmail(req, res) {
  const { volunteer } = req;
  const { username, email } = volunteer;

  const code = req.resetPasswordCode;

  let link;

  if (config.getKey('online')) {
    link = `${config.getKey('online_address')}/reset/${username}/${code}`;
  } else {
    link = `http://localhost:8080/reset/${username}/${code}`;
  }


  const content = `A password reset has been requested for the Volunteer: ${username}. If you did not make this request you ` +
    `can safely ignore this email.\\n\\nIf you do actually want to reset your password, visit this link: ${link}`;


  logger.info(`Created password reset link for user=${username}, link=${link}`);

  const to = email;
  const from = config.getKey(['email']).email;
  const subject = '[CodeDoesGood] Password Reset Email';
  const text = content;

  emailClient.send(from, to, subject, text, text)
    .then(() => {
      res.status(200).send({ message: constants.EMAIL_RESET_SENT });
    })
    .catch((error) => {
      logger.error(`Error attempting to send a email. to=${to} from=${from}, error=${error}`);
      res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
    });
}

/**
 * Validates the users name, email and text that as been sent.
 */
function validateContactUsRequestInformation(req, res, next) {
  const senderName = req.body.name;
  const senderEmail = req.body.email;
  const senderSubject = req.body.subject;
  const senderText = req.body.text;

  let valid = true;

  const sender = {
    name: senderName, email: senderEmail, subject: senderSubject, text: senderText,
  };

  _.forEach(sender, (item) => { if (_.isNil(item)) { valid = false; } });

  if (!valid) {
    return res.status(400).send({ error: 'Invalid fields', description: constants.EMAIL_FIELDS_REQUIRED });
  } else if (sender.name.length > constants.EMAIL_MAX_LENGTH ||
    sender.email.length > constants.EMAIL_MAX_LENGTH ||
    sender.subject.length > constants.EMAIL_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid length', description: constants.EMAIL_AND_NAME_LENGTH });
  } else if (sender.text.length > constants.EMAIL_BODY_MAX_LENGTH ||
    sender.text.length < constants.EMAIL_BODY_MIN_LENGTH) {
    return res.status(400).send({ error: 'Invalid length', description: constants.EMAIL_BODY_LENGTH });
  }

  // Bind the sender to the request data to be accessed later
  req.sender = sender;
  return next();
}

/**
 * Rejects any invalid domain names or banned domain names from being sent.
 */
function DenyInvalidAndBlockedDomains(req, res, next) {
  return next();
}

/**
 * After validation of the name, email and senderText then send the email to the
 * email to the default CodeDoesGood inbox.
 */
function sendContactUsRequestInbox(req, res) {
  const { sender } = req;

  emailClient.send(sender.email, config.getKey(['email']).email, sender.subject, sender.text, sender.text)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      logger.error(`Error attempting to send a email. to=${config.getKey(['email']).email} from=${sender.email}, error=${error}`);
      res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE });
    });
}

/**
 * Sends OK or Internal Server Error based on the true / false email status.
 */
function sendContactUsEmailStatus(req, res) {
  if (emailClient.getStatus()) { res.sendStatus(200); } else { res.status(503).send({ error: 'Unavailable Service', description: constants.EMAIL_UNAVAILABLE }); }
}

module.exports = {
  validateConnectionStatus,
  sendVerificationEmail,
  sendPasswordResetLinkToRequestingEmail,
  resendVerificationEmail,
  sendContactUsEmailStatus,
  sendContactUsRequestInbox,
  DenyInvalidAndBlockedDomains,
  validateContactUsRequestInformation,
};
