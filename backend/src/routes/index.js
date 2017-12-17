const { Router } = require('express');

const authentication = require('./authentication');
const infrastructure = require('./infrastructure');
const project = require('./project');
const projects = require('./projects');
const volunteer = require('./volunteer');

const router = Router();

router.use(authentication);
router.use(infrastructure);
router.use(projects);
router.use(project);
router.use(volunteer);

module.exports = router;
