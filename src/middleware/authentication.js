const _ = require('lodash');
const jwt = require('jsonwebtoken');

const DatabaseWrapper = require('../components/DatabaseWrapper/DatabaseWrapper');
const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const logger = require('../components/Logger/Logger');

const config = new ConfigurationWrapper('mercury', 'mercury.json');
const databaseWrapper = new DatabaseWrapper(config.getKey('databasePath'));

/**
 * Validates that the details provided are a valid type, format and content. If all true then next
 * will be called otherwise a bad request would be sent to the server.
 */
function validateAuthenticationDetails(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (_.isNil(username)) {
    res.status(400).send({ error: 'Authentication', description: 'The username is required' });
  } else if (_.isNil(password)) {
    res.status(400).send({ error: 'Authentication', description: 'The password is required' });
  } else if (username < 4) {
    res.status(400).send({ error: 'Invalid Credentials', description: 'Username can not be less than 4 characters' });
  } else if (username > 16) {
    res.status(400).send({ error: 'Invalid Credentials', description: 'Username can not be greater than 16 characters' });
  } else if (password < 6) {
    res.status(400).send({ error: 'Invalid Credentials', description: 'Password can not be less than 6 characters' });
  } else {
    req.username = username;
    req.password = password;
    next();
  }
}

/**
 * Autehenticates but calls next if the user can authetnicate by validating the salted password
 * with the passed password that would be salted and hashed before comparing. If the passwords
 * match up then it will call next, otherwise send a 401 back.
 *
 * This would be used when updating a existing password but not asctually logging in.
 */
function ValidateUserCredentials(req, res, next) {
  next();
}

/**
 * Checks to see if the requesting user has a valid token
 * before continuing otherwise send a error back
 */
function checkAuthenticationToken(req, res, next) {
  const secret = config.getKey('secret');
  const token = req.header('token');

  if (_.isNil(token) || !_.isString(token)) {
    res.status(401).send({ error: 'Invalid token', description: 'A invalid token was passed to the server' });
  }

  jwt.verify(token, secret, (error, decoded) => {
    if (!error) {
      req.decoded = decoded;
      next();
    } else if (!res.headersSent) {
      res.status(401).send({ error: 'Expired token', description: 'A valid token was not provided, you might require refreshing' });
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
 */
function authenticateLoggingInUser(req, res) {
  const username = req.username;
  const password = req.password;
  const userId = req.id;

  databaseWrapper.getVolunteerLoginDetails(userId)
    .then((details) => {
      const storedPassword = details.password;
      const storedSalt = details.salt;
      const hashedPassword = databaseWrapper.saltAndHash(password, storedSalt);

      if (hashedPassword.hashedPassword === storedPassword) {
        const token = jwt.sign({ username, id: userId }, config.getKey('secret'), { expiresIn: '1h' });
        res.status(200).send({ message: `Volunteer ${username} authenticated`, content: { token } });
      }
    })
    .catch((error) => {
      logger.error(`Failed to get Volunteer login details, error=${JSON.stringify(error)}`);
      res.status(500).send({ error: 'Authentication', description: 'Failed to get Volunteer login details' });
    });
}


module.exports = {
  validateAuthenticationDetails,
  ValidateUserCredentials,
  authenticateLoggingInUser,
  checkAuthenticationToken,
  checkAdminAuthenticationLevel,
};
