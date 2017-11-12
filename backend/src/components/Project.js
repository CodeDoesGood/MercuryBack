/* eslint dot-notation: 0 */

const _ = require('lodash');
const Promise = require('bluebird');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const Database = require('./DatabaseWrapper');

const config = new ConfigurationWrapper('mercury', 'mercury.json');

/**
 * Interface for everything that is needed for a Project
 * @param projectId can pass project id to be used when checking existence by default
 */
class Project extends Database {
  constructor(projectId = null) {
    if (!_.isNil(projectId) && !_.isInteger(projectId)) {
      throw new Error('When provided projectId must be a integer');
    }

    super(config.getKey('database'));
    this.doesExist = false;

    this.project_id = projectId;
    this.createdDateTime = null;
    this.title = null;
    this.status = null;
    this.projectCategory = null;
    this.hidden = null;
    this.imageDirectory = null;
    this.summary = null;
    this.description = null;
  }

  /**
   * Returns the project based on id
   */
  exists() {
    if (_.isNil(this.project_id) || !_.isNumber(parseInt(this.project_id, 10))) {
      return Promise.reject(`id '${this.project_id}' passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('project').where('project_id', this.project_id).first())
      .then((project) => {
        if (_.isNil(project)) {
          return Promise.reject(`Project ${this.project_id} does not exist`);
        }
        this.createdDateTime = project['created_datetime'];
        this.title = project.title;
        this.status = project.status;
        this.projectCategory = project['project_category'];
        this.hidden = project.hidden;
        this.imageDirectory = project['image_directory'];
        this.summary = project.summary;
        this.description = project.description;
        this.doesExist = true;
        return Promise.resolve();
      });
  }

  /**
   * Updates a project by id with the provided content
   */
  updateContent() {
    if (_.isNil(this.project_id) || !_.isNumber(this.project_id)) {
      return Promise.reject(`Id "${this.project_id}" passed is not a valid number`);
    } else if (!this.doesExist) {
      return Promise.reject(`Project ${this.project_id} does not exist or has not been checked for existence yet`);
    }

    // TODO: This must validate that the content of the project being updated
    // TODO: all the correct format and not null when required

    return this.connect()
      .then(() => this.knex('project').where('project_id', this.project_id).update({
        title: this.title,
        status: this.status,
        project_category: this.projectCategory,
        hidden: this.hidden,
        image_directory: this.imageDirectory,
        summary: this.summary,
        description: this.description,
      }))
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns all the content of the project.
   */
  getContent() {
    return {
      project_id: this.project_id,
      created_datetime: this.createdDateTime,
      title: this.title,
      status: this.status,
      project_category: this.projectCategory,
      hidden: this.hidden,
      image_directory: this.imageDirectory,
      summary: this.summary,
      description: this.description,
    };
  }
}

module.exports = Project;
