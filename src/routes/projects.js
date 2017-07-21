const projects = require('../middleware/projects');
const authentication = require('../middleware/authentication');
const database = require('../middleware/database');

const Router = require('express').Router;

const router = Router();

/**
 * These routes are for getting project(s) by a value. id, status, category
 */
router.get('/projects/all/active', [
  database.validateConnectionStatus.bind(this),
  projects.getAllActiveProjects.bind(this),
]);

router.get('/projects/all', [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.getAllProjects.bind(this),
]);

router.get('/projects/status/:status', [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.validateProjectStatus.bind(this),
  projects.getAllProjectsByStatus.bind(this),
]);

router.get('/projects/category/:category', [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.validateProjectCategory.bind(this),
  projects.getAllProjectsByCategory.bind(this),
]);

router.get('/projects/all/hidden', [
  database.validateConnectionStatus.bind(this),
  authentication.checkAuthenticationToken.bind(this),
  authentication.checkAdminAuthenticationLevel.bind(this),
  projects.getAllHiddenProjects.bind(this),
]);

module.exports = router;
