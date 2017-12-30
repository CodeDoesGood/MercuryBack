import { Router } from 'express';
import { email } from './routing.table';

import * as authentication from '../middleware/authentication';
import * as emailService from '../middleware/email';
import * as infrastructure from '../middleware/infrastructure';

const router: Router | any = Router();

/**************************************************************************************************
                                        Email Routes
**************************************************************************************************/

/******************
    Restart
******************/

router[email.SERVICE.RESTART.method](email.SERVICE.RESTART.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminPortalAccess.bind(this),
  emailService.reverifyTheService.bind(this),
]);

/******************
    Stored
******************/

router[email.STORED.SEND.method](email.STORED.SEND.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminPortalAccess.bind(this),
  emailService.sendStoredLateEmails.bind(this),
]);

router[email.STORED.RETRIEVE.method](email.STORED.RETRIEVE.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminPortalAccess.bind(this),
  emailService.retrieveStoredLateEmails.bind(this),
]);

router[email.STORED.REMOVE.method](email.STORED.REMOVE.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminPortalAccess.bind(this),
  emailService.removeStoredEmailByIndex.bind(this),
]);

export default router;
