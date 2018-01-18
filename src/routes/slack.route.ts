import { Router } from 'express';
import { slack } from './routing.route';

import * as authentication from '../controllers/authentication.controller';
import * as slacking from '../controllers/slack.controller';

const router: Router | any = Router();

router[slack.HEALTH.method](slack.HEALTH.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminPortalAccess.bind(this),
  slacking.sendHeathCheck.bind(this),
]);

export default router;
