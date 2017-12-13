const _ = require('lodash');
const jwt = require('jsonwebtoken');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const constants = require('../components/constants');
const logger = require('../components/Logger');
const Volunteer = require('../components/Volunteer');

const config = new ConfigurationWrapper('mercury', 'mercury.json');

/**
 * Validates that the details provided are a valid type, format and content. If all true then next
 * will be called otherwise a bad request would be sent to the server.
 * @param {string} req.body.username The users username to be validate
 * @param {string} req.body.password  The old password of the user to validate
 */
function validateAuthenticationDetails(req, res, next) {
  const { username, password } = req.body;

  if (_.isNil(username)) {
    res.status(401).send({ error: 'Authentication', description: constants.USERNAME_REQUIRED });
  } else if (_.isNil(password)) {
    res.status(401).send({ error: 'Authentication', description: constants.PASSWORD_REQUIRED });
  } else if (username < constants.USERNAME_MIN_LENGTH) {
    res.status(401).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_CREDENTIALS_LENGTH });
  } else if (username > constants.USERNAME_MAX_LENGTH) {
    res.status(401).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_CREDENTIALS_LENGTH });
  } else if (password < constants.PASSWORD_MIN_LENGTH) {
    res.status(401).send({ error: 'Invalid Credentials', description: constants.INVALID_PASSWORD_CREDENTIALS_LENGTH });
  } else {
    req.username = username;
    req.password = password;
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
function ValidateUserCredentials(req, res, next) {
  const { username } = req;
  const password = req.oldPassword;

  const volunteer = new Volunteer(null, username);

  volunteer.exists('username')
    .then(() => {
      if (volunteer.compareAuthenticatingPassword(password)) {
        req.volunteer = volunteer;
        next();
      } else {
        res.status(401).send({ error: 'Validate user credentials', description: constants.INCORRECT_PASSWORD });
      }
    })
    .catch((error) => {
      logger.error(`Failed to gather volunteer login details by username while validating user credentials, error=${error}`);
      res.status(500).send({ error: 'Validate user credentials', description: constants.FAILED_VALIDATION });
    });
}

/**
 * Checks to see if the requesting user has a valid token
 * before continuing otherwise send a error back
 * @param {string} req.header('token') The token used for checking authentication
 */
function checkAuthenticationToken(req, res, next) {
  const secret = config.getKey('secret');
  const token = req.header('token');

  if (_.isNil(token) || !_.isString(token)) {
    res.status(401).send({ error: 'Invalid token', description: constants.INVALID_TOKEN });
  }

  jwt.verify(token, secret, (error, decoded) => {
    if (!error) {
      req.decoded = decoded;
      next();
    } else if (!res.headersSent) {
      res.status(401).send({ error: 'Expired token', description: constants.NO_TOKEN_PASSED });
    }
  });
}

/**
 * Check to see if the authenticated user is currently a active admin.
 */
function checkAdminAuthenticationLevel(req, res, next) {
  next();
}

/**
 * Attempts to authenticate the user with the active directory
 * and binds them a token that will be used for all future
 * requests
 * @param {string} req.username The username of the user
 * @param {string} req.password The password of the user
 */
function authenticateLoggingInUser(req, res) {
  const { username, password } = req;
  const userId = parseInt(req.id, 10);
  const volunteer = new Volunteer(userId, username);

  volunteer.exists()
    .then(() => {
      if (volunteer.compareAuthenticatingPassword(password)) {
        if (!volunteer.getVerification()) {
          res.status(403).send({ error: 'Failed verification check', description: constants.VOLUNTEER_VERIFICATION_REQUIRED(volunteer.username), failed_verify: true });
        } else {
          const token = jwt.sign({ username, id: userId }, config.getKey('secret'), { expiresIn: '1h' });
          res.status(200).send({ message: `Volunteer ${username} authenticated`, content: { token, username, id: userId } });
        }
      } else {
        res.status(401).send({ error: 'Volunteer authentication', description: constants.INCORRECT_PASSWORD });
      }
    })
    .catch((error) => {
      logger.error(`Failed to get Volunteer login details, error=${JSON.stringify(error)}`);
      res.status(500).send({ error: 'Authentication', description: constants.FAILED_VOLUNTEER_GET(error) });
    });
}

module.exports = {
  validateAuthenticationDetails,
  ValidateUserCredentials,
  authenticateLoggingInUser,
  checkAuthenticationToken,
  checkAdminAuthenticationLevel,
};
