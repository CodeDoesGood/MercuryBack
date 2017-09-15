const authentication = require('../middleware/authentication');
const database = require('../middleware/database');
const email = require('../middleware/email');
const volunteer = require('../middleware/volunteer');

const Router = require('express').Router;

const router = Router();

/**
 * These routes are for getting and updating single projects by id
 */

router.post('/volunteer/create', [
  volunteer.validateVolunteerCreationDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  database.validateUsernameDoesNotExist.bind(this),
  database.validateEmailDoesNotExist.bind(this),
  volunteer.createNewVolunteer.bind(this),
  email.validateConnectionStatus.bind(this),
  email.sendVerificationEmail.bind(this),
]);

/**
 * Verify is after a volunteer registers with a account, a email woudld be sent to the
 * volunteer to verify there account
 */
router.post('/volunteer/verify/:username/:code', [
  database.validateConnectionStatus.bind(this),
  database.validateUsernameDoesExist.bind(this),
  volunteer.validateVerifyCodeExists.bind(this),
  volunteer.validateVerifyCodeAuthenticity.bind(this),
  volunteer.verifyVolunteerAccount.bind(this),
]);

/**
 * Request a password reset email to the users account
 */
router.post('/volunteer/password/request_reset', [
  volunteer.validateRequestResetDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  database.validateEmailDoesExist.bind(this),
  volunteer.createPasswordResetCode.bind(this),
  email.validateConnectionStatus.bind(this),
  email.sendPasswordResetLinkToRequestingEmail.bind(this),
]);

/**
 * Request a password reset email to the users account
 */
router.post('/volunteer/password/reset', [
  database.validateConnectionStatus.bind(this),
  volunteer.validatePasswordResetDetails.bind(this),
  volunteer.validatePasswordDetail.bind(this),
  volunteer.validateResetCodeExists.bind(this),
  volunteer.validatePasswordResetCodeAuthenticity.bind(this),
  volunteer.updateUsersPassword.bind(this),
]);

/**
 * Request that the password can be updated, will have to contain
 * the username, current password and replacing password.
 */
router.post('/volunteer/password/update', [
  volunteer.validatePasswordDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  database.validateUsernameDoesExist.bind(this),
  authentication.ValidateUserCredentials.bind(this),
  volunteer.updateUsersPassword.bind(this),
]);

module.exports = router;

