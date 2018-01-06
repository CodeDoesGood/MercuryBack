import { Router } from 'express';
import { slack } from './routing.table';

import * as authentication from '../middleware/authentication';
import * as slacking from '../middleware/slack';

const router = Router();

router[slack.HEALTH.method](slack.HEALTH.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminPortalAccess.bind(this),
  slacking.sendHeathCheck.bind(this),
]);

export default router;
