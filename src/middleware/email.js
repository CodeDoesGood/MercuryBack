const _ = require('lodash');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const EmailClient = require('../components/Email/Email');
const logger = require('../components/Logger/Logger');

const config = new ConfigurationWrapper('mercury', 'mercury.json');
const emailClient = new EmailClient(config.getKey('email'));
/**
 * This will Validate that the email service is currently up and running and call next otherwise
 * send a 500 internal server that the service is currenlty not working but they can still login
 * and a validation email will be sent out as soon as the service is running again.
 */
function validateConnectionStatus(req, res, next) {
  if (emailClient.getStatus()) {
    next();
  } else {
    res.status(503).send({ error: 'Email Service', description: 'The email service is currently unavailable, your email will be sent later' });
  }
}

/**
 * Will send a validation email to the new volunteer via there email, allowing them
 * to confirm there current email address.
 */
function sendVerificationEmail(req, res) {
  const volunteer = req.volunteer;
  const verificationLink = `localhost:3000/${volunteer.username}/${volunteer.verificationCode}`;

  // This is currently here because we have no email service
  logger.debug('link for user', volunteer.username, verificationLink);

  const to = req.volunteer.email;
  const from = config.getKey(['email']).email;
  const subject = '[CodeDoesGood] Verification Email';
  const text = verificationLink;

  emailClient.send(from, to, subject, text, text)
    .then(() => {
      res.status(200).send({ message: `Account ${volunteer.username} created, you will soon get a verification email` });
    })
    .catch((error) => {
      logger.error(`Error attempting to send a email. to=${to} from=${from}, error=${error}`);
      res.status(503).send({ error: 'Unavailable Service', description: 'Email service is currently unavailable or down' });
    });

  res.status(503).send({ error: 'Currently unavailable', description: 'This service is currently unavailable' });
}

/**
 * Generates and emails a link to the user for resetting the users password.
 * The front end will then route to a functional page that will post back
 * to reset the users password.
 */
function sendPasswordResetLinkToRequestingEmail(req, res) {
  const code = req.resetPasswordCode
  res.status(503).send({ error: 'Currently unavailable', description: 'This service is currently unavailable' });
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

  const sender = { name: senderName, email: senderEmail, subject: senderSubject, text: senderText };
  _.forEach(sender, (item) => { if (_.isNil(item)) { valid = false; } });

  if (!valid) {
    return res.status(400).send({ error: 'Invalid fields', description: 'Please, make sure you\'ve filled all of the required fields' });
  } else if (sender.name.length > 50 || sender.email.length > 50 || sender.subject.length > 50) {
    return res.status(400).send({ error: 'Invalid length', description: 'Please make sure email and name are less than 50 characters each' });
  } else if (sender.text.length > 500 || sender.text.length < 5) {
    return res.status(400).send({ error: 'Invalid length', description: 'Please use less than 500 characters for contact text or greater than 5' });
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
 * email to the deafult CodeDoesGood inbox.
 */
function sendContactUsRequestInbox(req, res) {
  const sender = req.sender;

  emailClient.send(sender.email, config.getKey(['email']).email, sender.subject, sender.text, sender.text)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      logger.error(`Error attempting to send a email. to=${config.getKey(['email']).email} from=${sender.email}, error=${error}`);
      res.status(503).send({ error: 'Unavailable Service', description: 'Email service is currently unavailable or down' });
    });
}

/**
 * Sends OK or Internal Server Error based on the true / false email status.
 */
function sendContactUsEmailStatus(req, res) {
  if (emailClient.getStatus()) { res.sendStatus(200); } else { res.status(503).send({ error: 'Unavailable Service', description: 'Email service is currently unavailable or down' }); }
}

module.exports = {
  validateConnectionStatus,
  sendVerificationEmail,
  sendPasswordResetLinkToRequestingEmail,
  sendContactUsEmailStatus,
  sendContactUsRequestInbox,
  DenyInvalidAndBlockedDomains,
  validateContactUsRequestInformation,
};
