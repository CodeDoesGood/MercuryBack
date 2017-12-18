const { projs } = require('./routing.table');
const { Router } = require('express');

const authentication = require('../middleware/authentication');
const database = require('../middleware/database');
const projects = require('../middleware/projects');


const router = Router();

/**
 * These routes are for getting project(s) by a value. id, status, category
 */
router.get(projs.ACTIVE, [
  database.validateConnectionStatus.bind(this),
  projects.getAllActiveProjects.bind(this),
]);

router.get(projs.ALL, [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.getAllProjects.bind(this),
]);

router.get(projs.CATEGORY, [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.validateProjectCategory.bind(this),
  projects.getAllProjectsByCategory.bind(this),
]);

router.get(projs.HIDDEN, [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.getAllHiddenProjects.bind(this),
]);

router.get(projs.STATUS, [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.validateProjectStatus.bind(this),
  projects.getAllProjectsByStatus.bind(this),
]);

module.exports = router;
