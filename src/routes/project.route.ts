import { Router } from 'express';
import { proj } from './routing.route';

import * as authentication from '../controllers/authentication.controller';
import * as database from '../controllers/database.controller';
import * as project from '../controllers/project.controller';

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
  authentication.checkAdminPortalAccess.bind(this),
  project.validateProjectUpdateContent.bind(this),
  project.validateProjectUpdateContentTypes.bind(this),
  database.validateConnectionStatus.bind(this),
  project.updateProjectById.bind(this),
]);

router[proj.CREATE.method](proj.CREATE.link, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminPortalAccess.bind(this),
  project.validateProjectCreationContent.bind(this),
  project.createNewProject.bind(this),
]);

export default router;
