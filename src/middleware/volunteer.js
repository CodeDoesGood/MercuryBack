const _ = require('lodash');

const logger = require('../components/Logger/Logger');
const Volunteer = require('../components/Volunteer/Volunteer');

/**
 * Validates that the user creation details are all there and contain all the correct information
 * including password length, username length, email type etc
 */
function validateVolunteerCreationDetails(req, res, next) {
  const volunteerRequirements = ['username', 'password', 'name', 'email', 'data_entry_user_id'];
  const volunteer = _.pick(req.body.volunteer, volunteerRequirements);

  if (_.isNil(volunteer) || !_.isObject(volunteer)) {
    return res.status(400).send({ error: 'volunteer Validation', description: 'volunteer provided is not in a valid format' });
  }

  _.forEach(volunteerRequirements, (requirement) => {
    if (!volunteer[requirement] && !res.headersSent) {
      return res.status(400).send({ error: 'Invalid Credentials', description: `Volunteer must contain ${requirement}` });
    } else if (requirement !== 'data_entry_user_id' && !_.isString(volunteer[requirement]) && !res.headersSent) {
      return res.status(400).send({
        error: 'Invalid Credentials Formatting',
        description: `Volunteer ${requirement} must be a string`,
      });
    }
    return 1;
  });

  /**
   * This will require better username and password requirements later on,
   * including blocking symbols etc
   */
  if (!res.headersSent) {
    if (volunteer.username < 4) {
      return res.status(400).send({ error: 'Invalid Credentials', description: 'Username can not be less than 4 characters' });
    } else if (volunteer.username > 16) {
      return res.status(400).send({ error: 'Invalid Credentials', description: 'Username can not be greater than 16 characters' });
    } else if (volunteer.password < 6) {
      return res.status(400).send({ error: 'Invalid Credentials', description: 'Password can not be less than 6 characters' });
    }
    volunteer.email = volunteer.email.toLowerCase();
    req.volunteer = volunteer;
    return next();
  }
  return 1;
}

/**
 * TODO: THIS
 */
function validateRequestResetDetails(req, res, next) {
  next();
}

/**
 * Generates a random number and a salt, salts and hashes a number and stores that in the database
 * under the password reset table with the id of the user, the salt and hashed code and the salt
 * that was used to salt and hash the stored code for use when validating the requesting code.
 * Then calls next where the code will be used to generate a link to send to the client which
 * will allow them to to send a reset request with the code and there new password.
 */
function createPasswordResetCode(req, res, next) {
  const username = req.username;
  const email = req.email;

  const volunteer = new Volunteer(null, username);
  volunteer.email = email;

  volunteer.exists('username')
    .then(() => volunteer.createPasswordResetCode())
    .then((code) => {
      req.resetPasswordCode = code;
      next();
    })
    .catch(error => res.status(500).send({ error: 'Password Creation', description: `unable to create password reset code, error=${error}` }));
}

/**
 * Checks and validates that the password being updated via the update ore reset code meets all
 * requirements otherwise sends 400.
 */
function validatePasswordDetails(req, res, next) {
  const password = req.body.password;
  const oldPassword = req.body.oldPassword;

  if (_.isNil(password) || _.isNil(oldPassword)) {
    res.status(400).send({ error: 'Param not provided', description: 'Both oldPassword and password need to be provided' });
  } else if (password.length < 6 || oldPassword.length < 6) {
    res.status(400).send({ error: 'Invalid Credentials', description: 'Password can not be less than 6 characters' });
  } else {
    req.password = password;
    req.oldPassword = oldPassword;
    next();
  }
}

/**
 * Pulls the code, salt, hashes the code emailed to the client with the stores salt then compares
 * the newly salted and hashed code with the already salted and hashed stored code to see if they
 * match and if they match call next, otherwise said a 401 invalid authentication. (meaning that
 * the code used into trying to verify the account was not the correct code).
 */
function validateVerifyCodeAuthenticity(req, res, next) {
  const code = req.code;
  const userId = req.id;

  const volunteer = new Volunteer(userId);

  volunteer.exists()
    .then(() => volunteer.getVerificationCode())
    .then((details) => {
      const storedCode = details.code;
      const storedSalt = details.salt;
      const hashedCode = volunteer.saltAndHash(code, storedSalt);

      if (hashedCode.hashedPassword === storedCode) {
        next();
      } else {
        res.status(401).send({ error: 'Invalid Code', description: 'The code passed was not the correct code for verification' });
      }
    })
    .catch(error => res.status(500).send({ error: 'Verification', descripion: `Failed to get verification code, error=${JSON.stringify(error)}` }));
}

/**
 * Updates the volunteers password with the new password by the
 * users id and then tells the client that there password has been updated.
 */
function updateUsersPassword(req, res) {
  const username = req.username;
  const userId = req.id;
  const password = req.password;

  const volunteer = new Volunteer(userId, username);

  volunteer.exists()
    .then(() => volunteer.updatePassword(password))
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

  const volunteer = new Volunteer(userId, username);

  volunteer.exists()
    .then(() => volunteer.removeVerificationCode())
    .then(() => volunteer.verify())
    .then(() => res.status(200).send({ message: `Volunteer ${username} email is now verified` }))
    .catch((error) => {
      logger.error(`Failed to mark account ${username} as verified, error=${JSON.stringify(error)}`);
      res.status(500).send({ error: 'Failed Verifing', description: `Failed to mark account ${username} as verified` });
    });
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

  const volunteer = new Volunteer(req.id, req.username);

  volunteer.exists()
    .then(() => volunteer.doesVerificationCodeExist())
    .then(() => next())
    .catch(error => res.status(400).send({ error: 'Code existence', description: 'Verification Code Does not exist', print: error }));
}

/**
 * Creates a new Volunteer within the database.
 */
function createNewVolunteer(req, res, next) {
  const vol = req.volunteer;

  const volunteer = new Volunteer(null, vol.username);

  volunteer.name = vol.name;
  volunteer.email = vol.email;

  volunteer.create(vol.password, 1)
    .then((details) => {
      req.volunteer.volunteer_id = details.id;
      req.verificationCode = details.code;
      next();
    })
    .catch(error => res.status(500).send({ error, description: `Failed to create the user ${volunteer.username}` }));
}


module.exports = {
  validateVolunteerCreationDetails,
  validateRequestResetDetails,
  validatePasswordDetails,
  validateVerifyCodeAuthenticity,
  updateUsersPassword,
  verifyVolunteerAccount,
  validateVerifyCodeExists,
  createNewVolunteer,
  createPasswordResetCode,
};
