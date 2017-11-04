const _ = require('lodash');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const constants = require('../components/constants');
const DatabaseWrapper = require('../components/DatabaseWrapper');

const config = new ConfigurationWrapper('mercury', 'mercury.json');

const databaseWrapper = new DatabaseWrapper(config.getKey('database'));

databaseWrapper.connect();

/**
 * Gets the current online status of the database wrapper, if online calls next otherwise sends
 * a internal server error to the client.
 */
function validateConnectionStatus(req, res, next) {
  if (databaseWrapper.getOnlineStatus()) {
    return next();
  }
  return res.status(503).send({ error: 'Database Connection', description: constants.DATABASE_UNAVAILABLE });
}

/**
 * Checks with the database to see if the username already exists and throws a bad request otherwise
 * calls next.
 */
function validateUsernameDoesNotExist(req, res, next) {
  const { username } = req.volunteer;

  databaseWrapper.doesUsernameExist(username)
    .then(() => res.status(403).send({ error: 'Username exists', description: constants.USERNAME_ALREADY_EXISTS(username) }))
    .catch(() => next());
}

/**
 * Checks with the database to see if the email already exists and throws a bad request otherwise
 * calls next.
 */
function validateEmailDoesNotExist(req, res, next) {
  const { email } = req.volunteer;

  databaseWrapper.doesEmailExist(email)
    .then(() => res.status(403).send({ error: 'Email exists', description: constants.EMAIL_ALREADY_EXISTS(email) }))
    .catch(() => next());
}

/**
 * Checks with the database to see if the username already exists and calls next otherwise
 * throws a bad request otherwise.
 */
function validateUsernameDoesExist(req, res, next) {
  const { username: username1 } = req.params;
  const { username: username2 } = req.body;
  const { username: username3 } = req;

  let username;

  if (!_.isNil(username1)) {
    username = username1;
  } else if (!_.isNil(username2)) {
    username = username2;
  } else if (!_.isNil(username3)) {
    username = username3;
  } else {
    res.status(400).send({ error: 'Username validation', description: constants.USERNAME_REQUIRED });
  }

  if (!res.headersSent) {
    databaseWrapper.doesUsernameExist(username)
      .then((id) => {
        req.id = id;
        req.username = username;
        next();
      })
      .catch(() => res.status(400).send({ error: 'Username does not exists', description: constants.USERNAME_DOES_NOT_EXIST(username) }));
  }
}

/**
 * Checks with the database to see if the email already exists and calls next otherwise
 * throws a bad request.
 */
function validateEmailDoesExist(req, res, next) {
  const { email: email1 } = req.params;
  const { email: email2 } = req.body;
  const { email: email3 } = req;

  let email;

  if (!_.isNil(email1)) {
    email = email1;
  } else if (!_.isNil(email2)) {
    email = email2;
  } else if (!_.isNil(email3)) {
    email = email3;
  } else {
    res.status(400).send({ error: 'Email validation', description: constants.EMAIL_REQUIRED });
  }

  req.email = email;

  if (!res.headersSent) {
    databaseWrapper.doesEmailExist(email)
      .then(() => next())
      .catch(() => res.status(400).send({ error: 'Email Does not exists', description: constants.EMAIL_DOES_NOT_EXIST(email) }));
  }
}

module.exports = {
  validateConnectionStatus,
  validateUsernameDoesNotExist,
  validateEmailDoesNotExist,
  validateUsernameDoesExist,
  validateEmailDoesExist,
};
