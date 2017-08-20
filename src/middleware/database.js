const _ = require('lodash');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const DatabaseWrapper = require('../components/DatabaseWrapper/DatabaseWrapper');
const logger = require('../components/Logger/Logger');

const config = new ConfigurationWrapper('mercury', 'mercury.json');
const databaseWrapper = new DatabaseWrapper(config.getKey('databasePath'));

/**
 * Gets the current online status of the database wrapper, if online calls next otherwise sends
 * a internal server error to the client.
 */
function validateConnectionStatus(req, res, next) {
  if (databaseWrapper.getOnlineStatus()) {
    return next();
  }
  return res.status(503).send({ error: 'Database Connection', description: 'The database service is currently unavailable' });
}

/**
 * Checks with the database to see if the username already exists and throws a bad request otherwise
 * calls next.
 */
function validateUsernameDoesNotExist(req, res, next) {
  const username = req.volunteer.username;

  databaseWrapper.doesUsernameExist(username)
    .then(() => res.status(403).send({ error: 'Username exists', description: `The username ${username} already exists` }))
    .catch(() => next());
}

/**
 * Checks with the database to see if the email already exists and throws a bad request otherwise
 * calls next.
 */
function validateEmailDoesNotExist(req, res, next) {
  const email = req.volunteer.email_address;

  databaseWrapper.doesEmailExist(email)
    .then(() => res.status(403).send({ error: 'Email exists', description: `The email ${email} already exist` }))
    .catch(() => next());
}

/**
 * Checks with the database to see if the username already exists and calls next otherwise
 * throws a bad request otherwise.
 */
function validateUsernameDoesExist(req, res, next) {
  let username;

  if (!_.isNil(req.params.username)) {
    username = req.params.username;
  } else if (!_.isNil(req.body.username)) {
    username = req.body.username;
  } else if (!_.isNil(req.username)) {
    username = req.username;
  } else {
    res.status(400).send({ error: 'Username validation', description: 'The username parameter was not passed' });
  }

  databaseWrapper.doesUsernameExist(username)
    .then((id) => {
      req.id = id;
      req.username = username;
      next();
    })
    .catch(() => {
      if (!res.headersSent) {
        res.status(400).send({ error: 'Username does not exists', description: `The username ${username} does not exists` });
      }
    });
}

/**
 * Checks with the database to see if the email already exists and calls next otherwise
 * throws a bad request.
 */
function validateEmailDoesExist(req, res, next) {
  const email = req.body.email_address;

  databaseWrapper.doesEmailExist(email)
    .then(() => next())
    .catch(() => res.status(400).send({ error: 'Email Does not exists', description: `The email ${email} does not exist` }));
}

/**
 * Pulls the code, salt, hashes the code emailed to the client with the stores salt then compares
 * the newly salted and hashed code with the already salted and hashed stored code to see if they
 * match and if they match call next, otherwise said a 401 invalid authentication. (meaning that
 * the code used into trying to verify the account was not the correct code)
 * @param req
 * @param res
 * @param next
 */
function validateVerifyCodeAuthenticity(req, res, next) {
  const code = req.code;
  const userId = req.id;

  databaseWrapper.getVerificationCode(userId)
    .then((details) => {
      const storedCode = details.code;
      const storedSalt = details.salt;

      const hashedCode = databaseWrapper.saltAndHash(code, storedSalt);

      if (hashedCode.hashedPassword === storedCode) {
        next();
      } else {
        res.status(401).send({ error: 'Invalid Code', description: 'The code passed was not the correct code for verification' });
      }
    })
    .catch(error => res.status(500).send({ error: 'Verification', description: `Failed to get verification code, error=${JSON.stringify(error)}` }));
}

/**
 * Checks to see that the validation code already exists in the verification table and calls next
 * otherwise sends a bad request.
 */
function validateVerifyCodeExists(req, res, next) {
  const code = req.params.code;
  const userId = req.id;

  if (_.isNil(code) || _.isNil(userId)) {
    res.status(500).send({ error: 'Validate Verify Code', description: 'The code provided was invalid' });
  }

  req.code = code;

  databaseWrapper.doesVerificationCodeExist(userId)
    .then(() => next())
    .catch(() => res.status(400).send({ error: 'Code existence', description: 'Verification Code Does not exist' }));
}

/**
 * Pulls the users verify code and salt from the verify table. Salts and hashes the passed code
 * with the stored salt. Compares the stored code with the newly salted code and calls next,
 * otherwise throws a 401 invalid authentication.
 */
function validateVerificationCode(req, res, next) {
  res.status(503).send({ error: 'Currently unavailable', description: 'This service is currently unavailable' });
  next();
}

/**
 * Creates a new Volunteer within the database.
 */
function createNewVolunteer(req, res, next) {
  const volunteer = req.volunteer;

  databaseWrapper.createNewVolunteer(volunteer)
    .then((details) => {
      req.volunteer.id = details.id;
      req.verificationCode = details.code;
      next();
    })
    .catch(error => res.status(500).send({ error: `${JSON.stringify(error)}`, description: `Failed to create the user ${volunteer.username}` }));
}

/**
 * Generates a random number and a salt, salts and hashes a number and stores that in the database
 * under the password reset table with the id of the user, the salt and hashed code and the salt
 * that was used to salt and hash the stored code for use when validating the requesting code.
 * Then calls next where the code will be used to generate a link to send to the client which
 * will allow them to to send a reset request with the code and there new password.
 */
function createPasswordResetCode(req, res, next) {
  res.status(503).send({ error: 'Currently unavailable', description: 'This service is currently unavailable' });
  next();
}

/**
 * Updates the users password with the new password by the users id and then tells the client that
 * there password has been updated.
 */
function updateUsersPassword(req, res) {
  const username = req.username;
  const userId = req.id;
  const password = req.password;

  databaseWrapper.updateVolunteerPasswordById(userId, password)
    .then(() => res.status(200).send({ message: `Volunteer ${username} password now updated` }))
    .catch((error) => {
      logger.error(`Failed to update password for ${username}, error=${JSON.stringify(error)}`);
      res.status(500).send({ error: 'Password updating', description: `Failed to update password for ${username}` });
    });
}

/**
 * Marks the account in the database as a verified account, allowing the user to login after the
 * set time period.
 */
function verifyVolunteerAccount(req, res) {
  const userId = req.id;
  const username = req.username;

  databaseWrapper.removeVerificationCode(userId);

  databaseWrapper.markVolunteerAsVerified(userId)
    .then(() => res.status(200).send({ message: `Volunteer ${username} email is now verified` }))
    .catch((error) => {
      logger.error(`Failed to mark account ${username} as verified, error=${JSON.stringify(error)}`);
      res.status(500).send({ error: 'Failed Verifing', description: `Failed to mark account ${username} as verified` });
    });
}


module.exports = {
  validateConnectionStatus,
  validateUsernameDoesNotExist,
  validateEmailDoesNotExist,
  validateUsernameDoesExist,
  validateEmailDoesExist,
  validateVerifyCodeExists,
  validateVerifyCodeAuthenticity,
  validateVerificationCode,
  verifyVolunteerAccount,
  createPasswordResetCode,
  updateUsersPassword,
  createNewVolunteer,
};
