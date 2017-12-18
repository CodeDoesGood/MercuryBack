const _ = require('lodash');
const Promise = require('bluebird');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const Database = require('./DatabaseWrapper');

const config = new ConfigurationWrapper('mercury', 'mercury.json');

/**
 * Interface for everything that is needed for a Projects
 */
class Projects extends Database {
  constructor() {
    super(config.getKey('database'));
  }
  /**
   * Returns all projects
   */
  getAllProjects() {
    return this.connect()
      .then(() => this.knex.select().from('project'))
      .then(projects => Promise.resolve(projects))
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns all active projects
   */
  getAllActiveProjects() {
    return this.connect()
      .then(() => this.knex('project').where('status', 1).andWhere('hidden', false))
      .then(projects => Promise.resolve(projects))
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns all projects marked by the status
   * @param status
   */
  getAllProjectsByStatus(status) {
    if (!_.isString(status) && !_.isNumber(status)) {
      return Promise.reject(new Error(`volunteerId "${status}" passed is not a valid string or number`));
    }

    return this.connect()
      .then(() => this.knex('project').where('status', status))
      .then(projects => Promise.resolve(projects))
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns all projects marked by the category
   * @param category
   */
  getAllProjectsByCategory(category) {
    if (!_.isString(category) && !_.isNumber(category)) {
      return Promise.reject(new Error(`volunteerId "${category}" passed is not a valid string or number`));
    }

    return this.connect()
      .then(() => this.knex('project').where('project_category', category))
      .then(projects => Promise.resolve(projects))
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns all projects marked as hidden
   */
  getAllHiddenProjects() {
    return this.connect()
      .then(() => this.knex('project').where('hidden', true))
      .then(projects => Promise.resolve(projects))
      .catch(error => Promise.reject(error));
  }
}

module.exports = Projects;
