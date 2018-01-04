import { Router } from 'express';
import { vol } from './routing.table';

import * as authentication from '../middleware/authentication';
import * as database from '../middleware/database';
import * as email from '../middleware/email';
import * as infrastructure from '../middleware/infrastructure';
import * as volunteer from '../middleware/volunteer';

const router: Router | any = Router();

/**************************************************************************************************
                                          Volunteer Routes
**************************************************************************************************/

/******************
      Account
******************/

router[vol.CREATE.method](vol.CREATE.link, [
  volunteer.validateVolunteerCreationDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  database.validateUsernameDoesNotExist.bind(this),
  database.validateEmailDoesNotExist.bind(this),
  volunteer.createNewVolunteer.bind(this),
  email.createVerificationEmail.bind(this),
  email.validateConnectionStatus.bind(this),
  email.sendEmail.bind(this),
]);

router[vol.REMOVE.method](vol.REMOVE.link, [infrastructure.unavailable.bind(this)]);

/******************
      Password
******************/

router[vol.PASSWORD.REQUEST_RESET.method](vol.PASSWORD.REQUEST_RESET.link, [
  volunteer.validateRequestResetDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  volunteer.createPasswordResetCode.bind(this),
  email.createPasswordResetLinkToRequestingEmail.bind(this),
  email.validateConnectionStatus.bind(this),
  email.sendEmail.bind(this),
]);

router[vol.PASSWORD.RESET.method](vol.PASSWORD.RESET.link, [
  database.validateConnectionStatus.bind(this),
  volunteer.validatePasswordResetDetails.bind(this),
  volunteer.validatePasswordDetail.bind(this),
  volunteer.validateResetCodeExists.bind(this),
  volunteer.validatePasswordResetCodeAuthenticity.bind(this),
  volunteer.updateUsersPassword.bind(this),
]);

router[vol.PASSWORD.UPDATE.method](vol.PASSWORD.UPDATE.link, [
  volunteer.validatePasswordDetails.bind(this),
  database.validateConnectionStatus.bind(this),
  authentication.validateUserCredentials.bind(this),
  volunteer.updateUsersPassword.bind(this),
]);

/******************
      Profile
******************/

router[vol.PROFILE.GET.method](vol.PROFILE.GET.link, [
  authentication.checkAuthenticationToken.bind(this),
  volunteer.gatherVolunteerProfile.bind(this),
]);

router[vol.PROFILE.REMOVE.method](vol.PROFILE.REMOVE.link, [infrastructure.unavailable.bind(this)]);
router[vol.PROFILE.UPDATE.method](vol.PROFILE.UPDATE.link, [infrastructure.unavailable.bind(this)]);

/******************
    Notification
******************/

router[vol.NOTIFICATION.GET.method](vol.NOTIFICATION.GET.link, [infrastructure.unavailable.bind(this)]);
router[vol.NOTIFICATION.DISMISS.method](vol.NOTIFICATION.DISMISS.link, [infrastructure.unavailable.bind(this)]);
router[vol.NOTIFICATION.UPDATE.method](vol.NOTIFICATION.UPDATE.link, [infrastructure.unavailable.bind(this)]);

/******************
    Notifications
******************/

router[vol.NOTIFICATIONS.GET.method](vol.NOTIFICATIONS.GET.link, [
  authentication.checkAuthenticationToken.bind(this),
  volunteer.gatherActiveNotifications.bind(this),
]);

router[vol.NOTIFICATIONS.DISMISS.method](vol.NOTIFICATIONS.DISMISS.link, [
  authentication.checkAuthenticationToken.bind(this),
  volunteer.validateNotificationId.bind(this),
  volunteer.markNotificationAsRead.bind(this),
]);

router[vol.NOTIFICATIONS.UPDATE.method](vol.NOTIFICATIONS.UPDATE.link, [infrastructure.unavailable.bind(this)]);

/******************
      Verify
******************/

router[vol.VERIFY.RESEND.method](vol.VERIFY.RESEND.link, [
  email.getResendVerifyDetails.bind(this),
  database.validateUsernameDoesExist.bind(this),
  email.createResendVerificationCode.bind(this),
  email.createResendVerificationEmail.bind(this),
  email.validateConnectionStatus.bind(this),
  email.sendEmail.bind(this),
]);

router[vol.VERIFY.VERIFY.method](vol.VERIFY.VERIFY.link, [
  database.validateConnectionStatus.bind(this),
  database.validateUsernameDoesExist.bind(this),
  volunteer.validateVerifyCodeExists.bind(this),
  volunteer.validateVerifyCodeAuthenticity.bind(this),
  volunteer.verifyVolunteerAccount.bind(this),
]);

/******************
      END
******************/

export default router;
