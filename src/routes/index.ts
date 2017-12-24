import { Router } from 'express';

import authentication from './authentication';
import infrastructure from './infrastructure';
import project from './project';
import projects from './projects';
import volunteer from './volunteer';

const router = Router();

router.use(authentication);
router.use(infrastructure);
router.use(projects);
router.use(project);
router.use(volunteer);

export default router;
