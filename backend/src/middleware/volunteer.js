const _ = require('lodash');

const constants = require('../components/constants');
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
    return res.status(400).send({ error: 'volunteer Validation', description: constants.INVALID_VOLUNTEER_FORMAT });
  }

  _.forEach(volunteerRequirements, (requirement) => {
    if (!volunteer[requirement] && !res.headersSent) {
      return res.status(400).send({ error: 'Invalid Credentials', description: constants.VOLUNTEER_REQUIREMENT_NEEDED(requirement) });
    } else if (requirement !== 'data_entry_user_id' && !_.isString(volunteer[requirement]) && !res.headersSent) {
      return res.status(400).send({
        error: 'Invalid Credentials Formatting',
        description: constants.VOLUNTEER_REQUIREMENT_STRING(requirement),
      });
    }
    return 1;
  });

  if (res.headersSent) {
    return 1;
  }

  const re = new RegExp('^[a-zA-Z0-9]+$');
  const reName = new RegExp('^[a-zA-Z- ]+$');
  const reEmail = new RegExp('^[a-zA-Z0-9@._-]+$');

  const userLen = volunteer.username.length;
  const passwordLen = volunteer.password.length;
  const emailLen = volunteer.email.length;
  const nameLen = volunteer.name.length;

  if (constants.PASSWORD_MIN_LENGTH > passwordLen || passwordLen > constants.PASSWORD_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_PASSWORD_LENGTH_ALL });
  } else if (constants.USERNAME_MIN_LENGTH > userLen || userLen > constants.USERNAME_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_LENGTH_ALL });
  } else if (constants.EMAIL_BODY_MIN_LENGTH > emailLen || emailLen > constants.EMAIL_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_EMAIL_LENGTH_ALL });
  } else if (constants.NAME_MIN_LENGTH > nameLen || nameLen > constants.NAME_MAX_LENGTH) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_NAME_TYPE });
  }

  if (volunteer.email.indexOf('@') === -1) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_EMAIL_NO_TYPE });
  }

  if (!re.test(volunteer.username)) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_USERNAME_SYMBOLS });
  } else if (!reEmail.test(volunteer.email)) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_EMAIL_SYMBOLS });
  } else if (!reName.test(volunteer.name)) {
    return res.status(400).send({ error: 'Invalid Credentials', description: constants.INVALID_NAME_SYMBOLS });
  }

  volunteer.email = volunteer.email.toLowerCase();
  req.volunteer = volunteer;
  return next();
}

/**
 * Validates that the user exists and that the email and username was passed.
 */
function validateRequestResetDetails(req, res, next) {
  const { username, email } = req.body;

  if (_.isNil(username)) {
    res.status(400).send({ error: 'Username validation', description: constants.USERNAME_REQUIRED });
  } else if (_.isNil(email)) {
    res.status(400).send({ error: 'Email validation', description: constants.EMAIL_REQUIRED });
  } else {
    const volunteer = new Volunteer(null, username);

    volunteer.exists('username')
      .then(() => {
        if (volunteer.email === email) {
          req.volunteer = volunteer;
          next();
        } else {
          res.status(400).send({ error: 'Email validation', description: constants.VOLUNTEER_EMAIL_MATCH });
        }
      })
      .catch(() => res.status(400).send({ error: 'User existence', message: constants.VOLUNTEER_EXISTS }));
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
  const { volunteer } = req;

  volunteer.createPasswordResetCode()
    .then((code) => {
      req.resetPasswordCode = code;
      next();
    })
    .catch(() => res.status(500).send({ error: 'Password reset code', description: constants.VOLUNTEER_RESET_CODE_FAIL }));
}

/**
 * Checks and validates that the password being updated via the update ore reset code meets all
 * requirements otherwise sends 400.
 */
function validatePasswordDetails(req, res, next) {
  const { password, oldPassword } = req.body;

  if (_.isNil(password) || _.isNil(oldPassword)) {
    res.status(400).send({ error: 'Param not provided', description: constants.VOLUNTEER_UPDATE_PASSWORD_REQUIRE });
  } else if (constants.PASSWORD_MAX_LENGTH < password.length < constants.PASSWORD_MIN_LENGTH ||
    constants.PASSWORD_MAX_LENGTH < oldPassword.length < constants.PASSWORD_MIN_LENGTH) {
    res.status(400).send({ error: 'Invalid Credentials', description: constants.PASSWORD_MIN_LENGTH });
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
  const { password } = req;

  if (_.isNil(password)) {
    res.status(400).send({ error: 'Param not provided', description: constants.PASSWORD_REQUIRED });
  } else if (password.length < 6) {
    res.status(400).send({ error: 'Invalid Credentials', description: constants.PASSWORD_MIN_LENGTH });
  } else {
    next();
  }
}

/**
 * Validates that all the required parts for resetting a password is given.
 */
function validatePasswordResetDetails(req, res, next) {
  const resetCode = req.body.reset_code;
  const { username, password } = req.body;

  if (_.isNil(resetCode)) {
    res.status(400).send({ error: 'Param not provided', description: constants.RESET_CODE_REQUIRED });
  } else if (_.isNil(username)) {
    res.status(400).send({ error: 'Param not provided', description: constants.USERNAME_REQUIRED });
  } else if (_.isNil(password)) {
    res.status(400).send({ error: 'Param not provided', description: constants.PASSWORD_REQUIRED });
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
  const { code, volunteer } = req;

  volunteer.getVerificationCode()
    .then((details) => {
      const storedCode = details.code;
      const storedSalt = details.salt;
      const hashedCode = volunteer.saltAndHash(code, storedSalt);

      if (hashedCode.hashedPassword === storedCode) {
        next();
      } else {
        res.status(401).send({ error: 'Invalid Code', description: constants.VOLUNTEER_INVALID_VERIFICATION_CODE });
      }
    })
    .catch(error => res.status(500).send({ error: 'Verification', description: constants.VOLUNTEER_FAILED_GET_VERIFICATION_CODE(error) }));
}

/**
 * validates that the passed code matches up with the salt and hashed code in
 * the password_reset_code table
 */
function validatePasswordResetCodeAuthenticity(req, res, next) {
  const code = req.resetCode;
  const { volunteer } = req;

  volunteer.getPasswordResetCode()
    .then((details) => {
      const storedCode = details.code;
      const storedSalt = details.salt;
      const hashedCode = volunteer.saltAndHash(code, storedSalt);

      if (hashedCode.hashedPassword === storedCode) {
        volunteer.removePasswordResetCode()
          .then(() => next())
          .catch(error => res.status(400).send({ error: 'Code removing', description: constants.VOLUNTEER_FAILED_REMOVE_RESET_CODE(error) }));
      } else {
        res.status(401).send({ error: 'Invalid Code', description: constants.VOLUNTEER_INVALID_VERIFICATION_CODE });
      }
    })
    .catch(error => res.status(500).send({ error: 'Verification', description: constants.VOLUNTEER_FAILED_GET_RESET_CODE(error) }));
}

/**
 *  Checks to see if the notification id is passed properly and passes it on correctly.
 */
function validateNotificationId(req, res, next) {
  const notificationId = req.body.notification_id;

  if (_.isNil(notificationId) || !_.isNumber(parseInt(notificationId, 10))) {
    res.status(400).send({ error: 'Invalid Notification Id', description: constants.NOTIFICATION_ID_REQUIRED });
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
  const { volunteer, password } = req;
  const { username } = volunteer;

  volunteer.updatePassword(password)
    .then(() => res.status(200).send({ message: `Volunteer ${username} password now updated` }))
    .catch((error) => {
      res.status(500).send({ error: 'Password updating', description: constants.VOLUNTEER_FAILED_UPDATE_PASSWORD(username, error) });
    });
}

/**
 * Marks the account in the database as a verified account, allowing the user to login after the
 * set time period.
 */
function verifyVolunteerAccount(req, res) {
  const { username, volunteer } = req;

  volunteer.removeVerificationCode()
    .then(() => volunteer.verify())
    .then(() => res.status(200).send({ message: `Volunteer ${username} email is now verified` }))
    .catch((error) => {
      logger.error(`Failed to mark account ${username} as verified, error=${JSON.stringify(error)}`);
      res.status(500).send({ error: 'Failed Verifying', description: constants.VOLUNTEER_VERIFY_MARK_FAIL(username) });
    });
}

/**
 * Checks to see that the validation code already exists in the verification table and calls next
 * otherwise sends a bad request.
 */
function validateVerifyCodeExists(req, res, next) {
  const { code } = req.body;
  const userId = req.id;

  if (_.isNil(code) || _.isNil(userId)) {
    res.status(500).send({ error: 'Validate Verify Code', description: constants.VERIFICATION_CODE_REQUIRED });
  }

  req.code = code;

  const volunteer = new Volunteer(req.id, req.username);

  req.volunteer = volunteer;

  volunteer.exists()
    .then(() => volunteer.doesVerificationCodeExist())
    .then(() => next())
    .catch(() => res.status(400).send({ error: 'Code existence', description: constants.VOLUNTEER_VERIFICATION_CODE_DOES_NOT_EXIST }));
}

/**
 * Checks that the given code matches the code (if any) in the password_reset_code table
 */
function validateResetCodeExists(req, res, next) {
  const { username } = req;

  const volunteer = new Volunteer(null, username);

  req.volunteer = volunteer;

  volunteer.exists('username')
    .then(() => volunteer.doesPasswordResetCodeExist())
    .then(() => next())
    .catch(() => res.status(400).send({ error: 'Code existence', description: constants.VOLUNTEER_VERIFICATION_CODE_DOES_NOT_EXIST }));
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
    .catch(error => res.status(500).send({
      error, description: constants.VOLUNTEER_CREATE_FAIL(volunteer.username, error),
    }));
}

/**
 * Gets all active notifications for the requesting user, requires authentication token.
 */
function gatherActiveNotifications(req, res) {
  const decodedToken = req.decoded;

  const { username } = decodedToken;
  const volunteerId = decodedToken.id;

  const volunteer = new Volunteer(volunteerId, username);

  volunteer.exists()
    .then(() => volunteer.getActiveNotifications())
    .then(notifications => res.status(200).send({ message: 'Gathered Notifications', content: { notifications } }))
    .catch(error => res.status(500).send({ error: 'Notifications error', description: constants.VOLUNTEER_GET_NOTIFICATION_FAIL(volunteer.username, error) }));
}

function markNotificationAsRead(req, res) {
  const decodedToken = req.decoded;

  const { notificationId } = req;
  const { username } = decodedToken;
  const volunteerId = decodedToken.id;

  const volunteer = new Volunteer(volunteerId, username);

  volunteer.exists()
    .then(() => volunteer.dismissNotification(notificationId))
    .then(() => res.sendStatus(200))
    .catch(error => res.status(500).send({ error: 'Notification dismissing', description: constants.VOLUNTEER_DISMISS_NOTIFICATION_FAIL(notificationId, error) }));
}

function gatherVolunteerProfile(req, res) {
  const decodedToken = req.decoded;

  const { username } = decodedToken;
  const volunteerId = decodedToken.id;

  const volunteer = new Volunteer(volunteerId, username);

  volunteer.exists()
    .then(() => res.status(200).send({ message: 'Volunteer Profile', content: { volunteer: volunteer.getProfile() } }))
    .catch(() => res.status(500).send({ error: 'User existing', description: constants.UNKNOWN_ERROR }));
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
  gatherVolunteerProfile,
  markNotificationAsRead,
};
