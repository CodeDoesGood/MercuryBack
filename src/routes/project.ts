import { Router } from 'express';
import { proj } from './routing.table';

import * as authentication from '../middleware/authentication';
import * as database from '../middleware/database';
import * as project from '../middleware/project';

const router: Router | any = Router();

/**************************************************************************************************
                                          Project Routes
**************************************************************************************************/

/******************
      Project
******************/

router[proj.GATHER.method](proj.GATHER.link, [
  database.validateConnectionStatus.bind(this),
  project.validateProjectId.bind(this),
  project.getProjectById.bind(this),
]);

router[proj.UPDATE.method](proj.UPDATE.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  project.validateProjectUpdateContent.bind(this),
  project.validateProjectUpdateContentTypes.bind(this),
  database.validateConnectionStatus.bind(this),
  project.updateProjectById.bind(this),
]);

export default router;
