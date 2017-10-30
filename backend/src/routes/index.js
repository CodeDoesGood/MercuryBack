const { Router } = require('express').Router;

const authentication = require('./authentication');
const project = require('./project');
const projects = require('./projects');
const volunteer = require('./volunteer');

const router = Router();

router.use(authentication);
router.use(projects);
router.use(project);
router.use(volunteer);

module.exports = router;
