import { Router } from 'express';

import authenticationRoute from './authentication.route';
import emailRoute from './email.route';
import infrastructureRoute from './infrastructure.route';
import projectRoute from './project.route';
import projectsRoute from './projects.route';
import slackRoute from './slack.route';
import volunteerRoute from './volunteer.route';

const router = Router();

router.use(authenticationRoute);
router.use(emailRoute);
router.use(infrastructureRoute);
router.use(projectsRoute);
router.use(projectRoute);
router.use(slackRoute);
router.use(volunteerRoute);

export default router;
