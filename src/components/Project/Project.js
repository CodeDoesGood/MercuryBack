const _ = require('lodash');
const Promise = require('bluebird');

const Database = require('../DatabaseWrapper/Database');

/**
 * Interface for everything that is needed for a Project
 */
class Project extends Database {
  constructor(id = null) {
    super();
    this.doesExist = false;

    this.id = id;
    this.dataEntryDate = null;
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
      if (!_.isNumber(parseInt(this.id, 10))) {
        reject(`id '${this.id}' passed is not a valid number`);
      }

      this.knex('project').where('id', this.id).first()
        .then((project) => {
          if (_.isNil(project)) {
            reject(`Project ${this.id} does not exist`);
          } else {
            this.dataEntryDate = project['data_entry_date'];
            this.title = project.title;
            this.status = project.status;
            this.projectCategory = project['project_category'];
            this.hidden = project.hidden;
            this.imageDirectory = project.imageDirectory;
            this.summary = project.summary;
            this.description = project.description;
          }
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Updates a project by id with the provided content
   * @param content The content in a object form that is being updated
   */
  updateContent(content) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(this.id)) {
        reject(`id "${this.id}" passed is not a valid number`);
      }

      this.knex('project').where('id', this.id).update(content)
        .then(updated => resolve(updated))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all the content of the project.
   */
  getContent() {
    return {
      id: this.id,
      dataEntryDate: this.dataEntryDate,
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
