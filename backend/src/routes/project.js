const { proj } = require('./routing.table');
const { Router } = require('express');

const authentication = require('../middleware/authentication');
const database = require('../middleware/database');
const project = require('../middleware/project');

const router = Router();

/**
 * These routes are for getting and updating single projects by id
 */

router.get(proj.GATHER, [
  database.validateConnectionStatus.bind(this),
  project.validateProjectId.bind(this),
  project.getProjectById.bind(this),
]);

router.post(proj.UPDATE, [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  project.validateProjectUpdateContent.bind(this),
  project.validateProjectUpdateContentTypes.bind(this),
  database.validateConnectionStatus.bind(this),
  project.updateProjectById.bind(this),
]);

module.exports = router;
