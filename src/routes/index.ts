import { Router } from 'express';

import authentication from './authentication';
import email from './email';
import infrastructure from './infrastructure';
import project from './project';
import projects from './projects';
import slack from './slack';
import volunteer from './volunteer';

const router = Router();

router.use(authentication);
router.use(email);
router.use(infrastructure);
router.use(projects);
router.use(project);
router.use(slack);
router.use(volunteer);

export default router;
