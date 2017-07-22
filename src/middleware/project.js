const _ = require('lodash');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const DatabaseWrapper = require('../components/DatabaseWrapper/DatabaseWrapper');

const config = new ConfigurationWrapper('mercury', 'mercury.json');
const databaseWrapper = new DatabaseWrapper(config.getKey('databasePath'));

/**
 * Validates that there is a project that exists by the id requested and calls next otherwise
 * sends a bad request back to the server.
 */
function validateProjectId(req, res, next) {
  const projectId = req.params.id;

  if (_.isNil(projectId) || !_.isString(projectId)) {
    res.status(500).send({ error: 'Status Validation', description: `Id '${projectId}' is in a invalid format or not provided` });
  } else {
    req.projectId = projectId;
    next();
  }
}

/**
 * Checks and confirms that all values exist that are required for updating the whole project or
 * creating a new project.
 */
function validateProjectUpdateContent(req, res, next) {
  const project = req.body.project;
  const projectRequirements = ['id', 'data_entry_date', 'data_entry_time', 'data_entry_user_id', 'title', 'status', 'project_category', 'image_directory', 'summary', 'description'];

  if (_.isNil(project) || !_.isObject(project)) {
    return res.status(400).send({ error: 'Project Validation', description: 'Project provided is not in a valid format' });
  }

  _.forEach(projectRequirements, (requirement) => {
    if (!project[requirement] && !res.headersSent) {
      return res.status(400).send({ error: 'Project Validation', description: `Project must contain ${requirement}` });
    }
    return 1;
  });

  /**
   * hidden is checked outside of the forEach because when you check !project[requirement]
   * with a boolean it would return true if the value is set to true, making it throw a
   * non existing error, wich in fact it does exit but the value is true, and not false.
   */
  if (!_.isBoolean(project.hidden)) {
    return res.status(400).send({ error: 'Project Validation', description: 'Project must contain hidden' });
  }

  if (!res.headersSent) {
    req.projectId = project.id;
    delete project.id;
    req.project = project;
    return next();
  }
  return 1;
}

/**
 * Validates that all provided values are the correct type.
 */
function validateProjectUpdateContentTypes(req, res, next) {
  const project = req.project;
  const projectId = req.projectId;

  if (!_.isInteger(projectId)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'id type is invalid, must be a int' });
  } else if (!_.isString(project.data_entry_date)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'data_entry_date type is invalid, must be a string' });
  } else if (!_.isString(project.data_entry_time)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'data_entry_time type is invalid, must be a string' });
  } else if (!_.isInteger(project.data_entry_user_id)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'data_entry_user_id type is invalid, must be a int' });
  } else if (!_.isString(project.title)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'title type is invalid, must be a string' });
  } else if (!_.isString(project.status)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'status type is invalid, must be a string' });
  } else if (!_.isInteger(project.project_category)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'project_category type is invalid, must be a int' });
  } else if (!_.isBoolean(project.hidden)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'hidden type is invalid, must be a bool' });
  } else if (!_.isString(project.image_directory)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'image_directory type is invalid, must be a string' });
  } else if (!_.isString(project.summary)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'summary type is invalid, must be a string' });
  } else if (!_.isString(project.description)) {
    res.status(400).send({ error: 'Project Type Validation', message: 'description type is invalid, must be a string' });
  } else {
    next();
  }
}

  /**
 * Updates a project in the project table by the project id,
 *
 * id is required in the req and so is the project object, bith are validated by the
 * validateProjectUpdateContent middleware.
 */
function updateProjectById(req, res) {
  const project = req.project;
  const projectId = req.projectId;

  databaseWrapper.updateProjectById(projectId, project)
    .then(() => res.status(200).send({ message: `Project updated id ${projectId}` }))
    .catch(error => res.status(500).send({ error: `${JSON.stringify(error)}`, description: `Unable to update project by id ${projectId}` }));
}
/**
 * Gets and sends the project requested by id.
 * @return a object containing all the project data.
 */
function getProjectById(req, res) {
  const projectId = req.projectId;

  databaseWrapper.getProjectById(projectId)
    .then(projects => res.status(200).send({ message: `Project By id ${projectId}`, content: { projects } }))
    .catch(error => res.status(500).send({ error: `${JSON.stringify(error)}`, description: `Unable to gather project by id ${projectId}` }));
}

module.exports = {
  validateProjectId,
  validateProjectUpdateContent,
  validateProjectUpdateContentTypes,
  getProjectById,
  updateProjectById,
};
