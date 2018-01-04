
import { Router } from 'express';

import * as authentication from '../middleware/authentication';
import * as database from '../middleware/database';

import { auth } from './routing.table';

const router: Router | any = Router();

/**************************************************************************************************
                                        Authentication Routes
**************************************************************************************************/

/******************
  Authentication
******************/

router[auth.VOLUNTEER.method](auth.VOLUNTEER.link, [
  authentication.validateAuthenticationDetails.bind(this),
  database.validateUsernameDoesExist.bind(this),
  authentication.authenticateLoggingInUser.bind(this),
]);

export default router;
