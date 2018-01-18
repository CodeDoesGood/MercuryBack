
import { Router } from 'express';

import * as authentication from '../controllers/authentication.controller';
import * as database from '../controllers/database.controller';

import { auth } from './routing.route';

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
