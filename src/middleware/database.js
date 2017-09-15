const _ = require('lodash');

const DatabaseWrapper = require('../components/DatabaseWrapper/DatabaseWrapper');

const databaseWrapper = new DatabaseWrapper();

databaseWrapper.connect();

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
  const email = req.volunteer.email;

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

  if (!res.headersSent) {
    databaseWrapper.doesUsernameExist(username)
    .then((id) => {
      req.id = id;
      req.username = username;
      next();
    })
    .catch(() => res.status(400).send({ error: 'Username does not exists', description: `The username ${username} does not exists` }));
  }
}

/**
 * Checks with the database to see if the email already exists and calls next otherwise
 * throws a bad request.
 */
function validateEmailDoesExist(req, res, next) {
  let email;

  if (!_.isNil(req.params.email)) {
    email = req.params.email;
  } else if (!_.isNil(req.body.email)) {
    email = req.body.email;
  } else if (!_.isNil(req.email)) {
    email = req.email;
  } else {
    res.status(400).send({ error: 'Email validation', description: 'The email parameter was not passed' });
  }

  if (!res.headersSent) {
    databaseWrapper.doesEmailExist(email)
    .then(() => next())
    .catch(() => res.status(400).send({ error: 'Email Does not exists', description: `The email ${email} does not exist` }));
  }
}

module.exports = {
  validateConnectionStatus,
  validateUsernameDoesNotExist,
  validateEmailDoesNotExist,
  validateUsernameDoesExist,
  validateEmailDoesExist,
};
