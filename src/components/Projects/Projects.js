const _ = require('lodash');
const Promise = require('bluebird');

const Database = require('../DatabaseWrapper/DatabaseWrapper');

/**
 * Interface for everything that is needed for a Projects
 */
class Projects extends Database {
  /**
   * Returns all projects
   */
  getAllProjects() {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => this.knex.select().from('project'))
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all active projects
   */
  getAllActiveProjects() {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => this.knex('project').where('status', 'active').andWhere('hidden', false))
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all projects marked by the status
   * @param status
   */
  getAllProjectsByStatus(status) {
    return new Promise((resolve, reject) => {
      if (!_.isString(status)) {
        reject(`volunteerId "${status}" passed is not a valid string`);
      }

      this.connect()
        .then(() => this.knex('project').where('status', status))
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all projects marked by the category
   * @param category
   */
  getAllProjectsByCategory(category) {
    return new Promise((resolve, reject) => {
      if (!_.isString(category)) {
        reject(`volunteerId "${category}" passed is not a valid string`);
      }

      this.connect()
        .then(() => this.knex('project').where('project_category', category))
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all projects marked as hidden
   */
  getAllHiddenProjects() {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(() => this.knex('project').where('hidden', true))
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }
}

module.exports = Projects;
