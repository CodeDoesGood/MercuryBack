const _ = require('lodash');

const logger = require('../components/Logger');
const Volunteer = require('../components/Volunteer');

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
 * Validates that the user exists and that the email and username was passed.
 */
function validateRequestResetDetails(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;

  if (_.isNil(username)) {
    res.status(400).send({ error: 'Username validation', description: 'The username parameter was not passed' });
  } else if (_.isNil(email)) {
    res.status(400).send({ error: 'Email validation', description: 'The email parameter was not passed' });
  } else {
    const volunteer = new Volunteer(null, username);

    volunteer.exists('username')
      .then(() => {
        if (volunteer.email === email) {
          req.volunteer = volunteer;
          next();
        } else {
          res.status(400).send({ error: 'Email validation', description: 'The email passed does not match the volunteer email' });
        }
      })
      .catch(() => res.status(400).send({ error: 'User existence', message: 'Volunteer does not exist' }));
  }
}

/**
 * Generates a random number and a salt, salts and hashes a number and stores that in the database
 * under the password reset table with the id of the user, the salt and hashed code and the salt
 * that was used to salt and hash the stored code for use when validating the requesting code.
 * Then calls next where the code will be used to generate a link to send to the client which
 * will allow them to to send a reset request with the code and there new password.
 */
function createPasswordResetCode(req, res, next) {
  const volunteer = req.volunteer;

  volunteer.createPasswordResetCode()
    .then((code) => {
      req.resetPasswordCode = code;
      next();
    })
    .catch(() => res.status(500).send({ error: 'Password reset code', description: 'Unable to generate password reset code' }));
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
 * Checks if the password (req.password) meets the required needs.
 */
function validatePasswordDetail(req, res, next) {
  const password = req.password;

  if (_.isNil(password)) {
    res.status(400).send({ error: 'Param not provided', description: 'password need to be provided' });
  } else if (password.length < 6) {
    res.status(400).send({ error: 'Invalid Credentials', description: 'Password can not be less than 6 characters' });
  } else {
    next();
  }
}

/**
 * Validates that all the required parts for resetting a password is given.
 */
function validatePasswordResetDetails(req, res, next) {
  const resetCode = req.body.reset_code;
  const username = req.body.username;
  const password = req.body.password;

  if (_.isNil(resetCode)) {
    res.status(400).send({ error: 'Param not provided', description: 'reset_code must be provided' });
  } else if (_.isNil(username)) {
    res.status(400).send({ error: 'Param not provided', description: 'username must be provided' });
  } else if (_.isNil(password)) {
    res.status(400).send({ error: 'Param not provided', description: 'password must be provided' });
  } else {
    req.resetCode = resetCode;
    req.username = username;
    req.password = password;
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

  const volunteer = req.volunteer;

  volunteer.getVerificationCode()
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
 * validates that the passed code matches up with the salt and hashed code in
 * the password_reset_code table
 */
function validatePasswordResetCodeAuthenticity(req, res, next) {
  const code = req.resetCode;

  const volunteer = req.volunteer;

  volunteer.getPasswordResetCode()
    .then((details) => {
      const storedCode = details.code;
      const storedSalt = details.salt;
      const hashedCode = volunteer.saltAndHash(code, storedSalt);

      if (hashedCode.hashedPassword === storedCode) {
        volunteer.removePasswordResetCode()
          .then(() => next())
          .catch(error => res.status(400).send({ error: 'Code removing', description: `Failed to remove password reset code: error=${JSON.stringify(error)}` }));
      } else {
        res.status(401).send({ error: 'Invalid Code', description: 'The code passed was not the correct code for verification' });
      }
    })
    .catch(error => res.status(500).send({ error: 'Verification', description: `Failed to get password reset code, error=${JSON.stringify(error)}` }));
}

/**
 *  Checks to see if the notification id is passed properly and passes it on correctly.
 */
function validateNotificationId(req, res, next) {
  const notificationId = req.body.notification_id;

  if (_.isNil(notificationId) || !_.isNumber(parseInt(notificationId, 10))) {
    res.status(400).send({ error: 'Invalid Notification Id', description: 'You must pass a notification id to dismiss' });
  } else {
    req.notificationId = parseInt(notificationId, 10);
    next();
  }
}

/**
 * Updates the volunteers password with the new password by the
 * users id and then tells the client that there password has been updated.
 */
function updateUsersPassword(req, res) {
  const volunteer = req.volunteer;

  const username = volunteer.username;
  const password = req.password;

  volunteer.updatePassword(password)
    .then(() => res.status(200).send({ message: `Volunteer ${username} password now updated` }))
    .catch((error) => {
      res.status(500).send({ error: 'Password updating', description: `Failed to update password for ${username}, error=${error}` });
    });
}

/**
 * Marks the account in the database as a verified account, allowing the user to login after the
 * set time period.
 */
function verifyVolunteerAccount(req, res) {
  const username = req.username;

  const volunteer = req.volunteer;

  volunteer.removeVerificationCode()
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

  req.volunteer = volunteer;

  volunteer.exists()
    .then(() => volunteer.doesVerificationCodeExist())
    .then(() => next())
    .catch(error => res.status(400).send({ error: 'Code existence', description: 'Verification Code Does not exist', print: error }));
}

/**
 * Checks that the given code matches the code (if any) in the password_reset_code table
 */
function validateResetCodeExists(req, res, next) {
  const username = req.username;

  const volunteer = new Volunteer(null, username);

  req.volunteer = volunteer;

  volunteer.exists('username')
    .then(() => volunteer.doesPasswordResetCodeExist())
    .then(() => next())
    .catch(error => res.status(400).send({ error: 'Code existence', description: `Verification Code Does not exist, error=${error}` }));
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
    .then((code) => {
      req.verificationCode = code;
      next();
    })
    .catch(error => res.status(500).send({ error, description: `Failed to create the user ${volunteer.username}, error=${error}` }));
}

/**
 * Gets all active notifications for the requesting user, requires authentication token.
 */
function gatherActiveNotifications(req, res) {
  const decodedToken = req.decoded;

  const username = decodedToken.username;
  const volunteerId = decodedToken.id;

  const volunteer = new Volunteer(volunteerId, username);

  volunteer.exists()
    .then(() => volunteer.getActiveNotifications())
    .then(notifications => res.status(200).send({ message: 'Gathered Notifications', content: { notifications } }))
    .catch(error => res.status(500).send({ error: 'Notifications error', description: `Failed to gather notifications for user ${volunteer.username}, error=${error}` }));
}

function markNotificationAsRead(req, res) {
  const decodedToken = req.decoded;

  const notificationId = req.notificationId;
  const username = decodedToken.username;
  const volunteerId = decodedToken.id;

  const volunteer = new Volunteer(volunteerId, username);

  volunteer.exists()
    .then(() => volunteer.dismissNotification(notificationId))
    .then(() => res.sendStatus(200))
    .catch(error => res.status(500).send({ error: 'Notification dismissing', description: `Unable to dismiss notification ${notificationId}, error=${error}` }));
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
  validatePasswordDetail,
  validatePasswordResetDetails,
  validateResetCodeExists,
  validatePasswordResetCodeAuthenticity,
  validateNotificationId,
  gatherActiveNotifications,
  markNotificationAsRead,
};
