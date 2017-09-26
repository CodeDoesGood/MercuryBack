const _ = require('lodash');

const constants = require('../components/constants');
const Projects = require('../components/Projects');

const projectsWrapper = new Projects();

/**
 * Gets and sends every single project that is active, inactive, hidden
 * @returns A array of objects containing all project details for
 * every single project.
 */
function getAllProjects(req, res) {
  projectsWrapper.getAllProjects()
    .then(projects => res.status(200).send({ message: 'All Projects', content: { projects } }))
    .catch(() => res.send(500).send({ error: 'Project Gathering', description: constants.UNABLE_TO_GATHER_PROJECTS }));
}

/**
 *Gets and sends every single active project.
 * @returns A array of objects containing all
 * details on active projects.
 */
function getAllActiveProjects(req, res) {
  projectsWrapper.getAllActiveProjects()
    .then(projects => res.status(200).send({ message: 'All Active Projects', content: { projects } }))
    .catch(error => res.status(500).send({ error: `${JSON.stringify(error)}`, description: constants.UNABLE_TO_GATHER_ACTIVE_PROJECTS }));
}

/**
 * When requesting for projects by status, this should validate that the status
 * being requested is a valid status that is being used within the database.
 * If there is no status of that type in the database then a invalid request should be
 * sent back to the server.
 *
 * If the status is valid then next would be called to move onto the next middleware.
 */
function validateProjectStatus(req, res, next) {
  const status = req.params.status;

  if (_.isNil(status) || !_.isString(status)) {
    res.status(500).send({ error: 'Status Validation', description: constants.INVALID_STATUS_FORMAT });
  } else {
    req.status = status;
    next();
  }
}

/**
 * Validates that the category is a valid format
 */
function validateProjectCategory(req, res, next) {
  const category = req.params.category;

  if (_.isNil(category) || !_.isString(category)) {
    res.status(500).send({ error: 'Category validation', description: constants.INVALID_CATEGORY_FORMAT});
  } else {
    req.category = category;
    next();
  }
}

/**
 * Gets and sends all projects by status
 * @returns A array of objects containing all project details of projects that match the requested
 * status.
 */
function getAllProjectsByStatus(req, res) {
  const status = req.status;

  projectsWrapper.getAllProjectsByStatus(status)
    .then(projects => res.status(200).send({ message: 'All projects by status', content: { projects } }))
    .catch(error => res.status(500).send({ error: `${JSON.stringify(error)}`, description: constants.UNABLE_TO_GATHER_BY_STATUS(status) }));
}

/**
 * Gets and sends all projects by category
 * @returns A array of objects containing all project details of projects that match the requested
 * category.
 */
function getAllProjectsByCategory(req, res) {
  const category = req.category;

  projectsWrapper.getAllProjectsByCategory(category)
    .then(projects => res.status(200).send({ message: 'All projects by category', content: { projects } }))
    .catch(error => res.status(500).send({ error: `${JSON.stringify(error)}`, description: constants.UNABLE_TO_GATHER_BY_CATEGORY(category) }));
}

/**
 * Gets and sends all hidden projects.
 * @returns A array of objects containing all project details of projects that are hidden
 */
function getAllHiddenProjects(req, res) {
  projectsWrapper.getAllHiddenProjects()
    .then(projects => res.status(200).send({ message: 'All hidden projects', content: { projects } }))
    .catch(error => res.status(500).send({ error: `${JSON.stringify(error)}`, description: constants.UNABLE_TO_GATHER_ALL_HIDDEN }));
}

module.exports = {
  getAllProjects,
  getAllActiveProjects,
  getAllProjectsByStatus,
  getAllProjectsByCategory,
  getAllHiddenProjects,
  validateProjectStatus,
  validateProjectCategory,
};
