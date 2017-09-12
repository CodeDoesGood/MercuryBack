/* eslint dot-notation: 0 */

const _ = require('lodash');
const Promise = require('bluebird');

const Database = require('../DatabaseWrapper/DatabaseWrapper');

/**
 * Interface for everything that is needed for a Project
 */
class Project extends Database {
  constructor(id = null) {
    super();
    this.doesExist = false;

    this.id = id;
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
   * @param id
   */
  exists() {
    return new Promise((resolve, reject) => {
      if (_.isNil(this.id) || !_.isNumber(parseInt(this.id, 10))) {
        reject(`id '${this.id}' passed is not a valid number`);
      }

      this.connect()
        .then(() => this.knex('project').where('project_id', this.id).first())
        .then((project) => {
          if (_.isNil(project)) {
            reject(`Project ${this.id} does not exist`);
          } else {
            this.createdDateTime = project['created_datetime'];
            this.title = project.title;
            this.status = project.status;
            this.projectCategory = project['project_category'];
            this.hidden = project.hidden;
            this.imageDirectory = project['image_directory'];
            this.summary = project.summary;
            this.description = project.description;
            this.doesExist = true;
            resolve();
          }
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Updates a project by id with the provided content
   */
  updateContent() {
    return new Promise((resolve, reject) => {
      if (_.isNil(this.id) || !_.isNumber(this.id)) {
        reject(`Id "${this.id}" passed is not a valid number`);
      } else if (!this.doesExist) {
        reject(`Project ${this.id} does not exist or has not been checked for existence yet`);
      }

      this.connect()
        .then(() => this.knex('project').where('id', this.id).update({
          title: this.title,
          status: this.status,
          project_category: this.projectCategory,
          hidden: this.hidden,
          image_directory: this.imageDirectory,
          summary: this.summary,
          description: this.description,
        }))
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all the content of the project.
   */
  getContent() {
    return {
      id: this.id,
      createdDateTime: this.createdDateTime,
      title: this.title,
      status: this.status,
      projectCategory: this.projectCategory,
      hidden: this.hidden,
      imageDirectory: this.imageDirectory,
      summary: this.summary,
      description: this.description,
    };
  }
}

module.exports = Project;
