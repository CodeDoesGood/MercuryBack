const Router = require('express').Router;

const authentication = require('./authentication');
const projects = require('./projects');
const project = require('./project');
const volunteer = require('./volunteer');

const router = Router();

router.use(authentication);
router.use(projects);
router.use(project);
router.use(volunteer);

module.exports = router;
