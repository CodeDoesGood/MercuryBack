const authentication = require('../middleware/authentication');
const database = require('../middleware/database');
const project = require('../middleware/project');

const Router = require('express').Router;

const router = Router();

/**
 * These routes are for getting and updating single projects by id
 */

router.get('/project/gather/:project_id', [
  database.validateConnectionStatus.bind(this),
  project.validateProjectId.bind(this),
  project.getProjectById.bind(this),
]);

router.post('/project/update/:project_id', [
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  project.validateProjectUpdateContent.bind(this),
  project.validateProjectUpdateContentTypes.bind(this),
  database.validateConnectionStatus.bind(this),
  project.updateProjectById.bind(this),
]);

module.exports = router;
