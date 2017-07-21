const _ = require('lodash');

/**
 * Validates that the user creation details are all there and contain all the correct information
 * including password length, username length, email type etc
 */
function validateVolunteerCreationDetails(req, res, next) {
  const volunteerRequirements = ['username', 'password', 'name', 'email_address', 'data_entry_user_id'];
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
    volunteer.email_address = volunteer.email_address.toLowerCase();
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
 * Checks and validates that the password being updated via the update ore reset code meets all
 * requirements otherwise sends 400.
 */
function validatePasswordDetails(req, res, next) {
  const password = req.body.password;
  const oldPasword = req.body.oldPassword;

  if (password < 6) {
    res.status(400).send({ error: 'Invalid Credentials', description: 'Password can not be less than 6 characters' });
  } else {
    req.password = password;
    req.oldPassword = oldPasword;
    next();
  }
}

module.exports = {
  validateVolunteerCreationDetails,
  validateRequestResetDetails,
  validatePasswordDetails,
};
