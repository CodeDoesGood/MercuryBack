const { Router } = require('express');
const { vol } = require('./routing.table');

const authentication = require('../middleware/authentication');
const database = require('../middleware/database');
const email = require('../middleware/email');
const volunteer = require('../middleware/volunteer');


const router = Router();

/**
 * routing for gathering volunteers active notifications
 */
router.get(vol.NOTIFICATIONS.GET, [
  authentication.checkAuthenticationToken.bind(this),
  volunteer.gatherActiveNotifications.bind(this),
]);

/**
 * marks the volunteer id that was passed via the body as read.
 */
router.post(vol.NOTIFICATIONS.DISMISS, [
  authentication.checkAuthenticationToken.bind(this),
  volunteer.validateNotificationId.bind(this),
  volunteer.markNotificationAsRead.bind(this),
]);

/**
 * Gets the volunteers profile
 */
router.get(vol.PROFILE, [
  authentication.checkAuthenticationToken.bind(this),
  volunteer.gatherVolunteerProfile.bind(this),
]);

/**
 * These routes are for getting and updating single projects by id
 */

router.post(vol.CREATE, [
  volunteer.validateVolunteerCreationDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  database.validateUsernameDoesNotExist.bind(this),
  database.validateEmailDoesNotExist.bind(this),
  volunteer.createNewVolunteer.bind(this),
  email.validateConnectionStatus.bind(this),
  email.sendVerificationEmail.bind(this),
]);

/**
 * Verify is after a volunteer registers with a account, a email would be sent to the
 * volunteer to verify there account
 */
router.post(vol.VERIFY.VERIFY, [
  database.validateConnectionStatus.bind(this),
  database.validateUsernameDoesExist.bind(this),
  volunteer.validateVerifyCodeExists.bind(this),
  volunteer.validateVerifyCodeAuthenticity.bind(this),
  volunteer.verifyVolunteerAccount.bind(this),
]);

/**
 * Resend the verification email if the volunteer is not already verified.
 */
router.get(vol.VERIFY.RESEND, [
  database.validateUsernameDoesExist.bind(this),
  email.resendVerificationEmail.bind(this),
]);

/**
 * Request a password reset email to the users account
 */
router.post(vol.PASSWORD.RERESET, [
  volunteer.validateRequestResetDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  volunteer.createPasswordResetCode.bind(this),
  email.validateConnectionStatus.bind(this),
  email.sendPasswordResetLinkToRequestingEmail.bind(this),
]);

/**
 * Request a password reset email to the users account
 */
router.post(vol.PASSWORD.RESET, [
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
router.post(vol.PASSWORD.UPDATE, [
  volunteer.validatePasswordDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  authentication.ValidateUserCredentials.bind(this),
  volunteer.updateUsersPassword.bind(this),
]);

module.exports = router;

