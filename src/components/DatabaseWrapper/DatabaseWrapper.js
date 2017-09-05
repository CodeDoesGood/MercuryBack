const _ = require('lodash');
const crypto = require('crypto');
const knex = require('knex');
const Promise = require('bluebird');

const logger = require('../Logger/Logger');

let instance = null;

class DatabaseWrapper {
  constructor() {
    if (instance) {
      return instance;
    }

    this.iterations = 28000;
    this.online = true;
    this.showMessage = true;

    this.connect();

    instance = this;
  }

  /**
   * Makes a connection to the postgres database
   */
  connect() {
    this.knex = knex({ client: 'mysql',
      connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'mercury',
      } });

    return this.knex.raw('select 1+1 AS answer')
      .then(() => {
        if (this.showMessage) {
          logger.info(`Successfully connected to knex: database`);
        }
      })
      .catch((error) => {
        this.online = false;
        logger.error(`Could not connect to knex database, error=${JSON.stringify(error)}`);
      });
  }

  /**
   * Returns the project based on id
   * @param id
   */
  getProjectById(id) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(parseInt(id, 10))) {
        reject(`projectId '${id}' passed is not a valid number`);
      }

      this.knex('project').where('id', id).first()
        .then(project => resolve(Object.assign({}, project)))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all projects
   */
  getAllProjects() {
    return new Promise((resolve, reject) => {
      this.knex.select().from('project')
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all active projects
   */
  getAllActiveProjects() {
    return new Promise((resolve, reject) => {
      this.knex('project').where('status', 'active').andWhere('hidden', false)
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

      this.knex('project').where('status', status)
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

      this.knex('project').where('project_category', category)
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns all projects marked as hidden
   */
  getAllHiddenProjects() {
    return new Promise((resolve, reject) => {
      this.knex('project').where('hidden', true)
        .then(projects => resolve(projects))
        .catch(error => reject(error));
    });
  }

  /**
   * Get a comment by the comment id
   * @param commentId
   */
  getCommentById(commentId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(commentId)) {
        reject(`commentId "${commentId}" passed is not a valid number`);
      }

      this.knex('comment').where('id', commentId).select().first()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get the project team by the team id
   * @param projectId
   */
  getProjectTeamById(teamId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(teamId)) {
        reject(`teamId "${teamId}" passed is not a valid number`);
      }

      this.knex('project_team').where('id', teamId).select().first()
        .then(projectTeam => resolve(projectTeam))
        .catch(error => reject(error));
    });
  }

  /**
   * Get the project team by the project id
   * @param projectId
   */
  getProjectTeamByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(projectId)) {
        reject(`projectId "${projectId}" passed is not a valid number`);
      }

      this.knex('project_team').where('project', projectId).first().select()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get a single activity by its id
   * @param projectActivityId
   */
  getProjectActiveityById(projectActivityId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(projectActivityId)) {
        reject(`projectActivityId "${projectActivityId}" passed is not a valid number`);
      }

      this.knex('project_activity').where('id', projectActivityId).select().first()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get all project activities by the project id
   * @param projectId
   */
  getAllProjectActivitiesByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(projectId)) {
        reject(`projectId "${projectId}" passed is not a valid number`);
      }

      this.knex('project_activity').where('project', projectId).select()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get volunteer announcement by id
   * @param announcementId
   */
  getVolunteerAnnouncementById(announcementId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(announcementId)) {
        reject(`announcementId "${announcementId}" passed is not a valid number`);
      }

      this.knex('volunteer_announcement').where('id', announcementId).select().first()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get all volunteer announcements by volunteer id
   * @param volunteerId
   */
  GetAllVolunteerAnnouncementsById(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('volunteer_announcement').where('volunteer_id', volunteerId).select()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get voluntere project announcement by id
   * @param projectAnnouncementId
   */
  getVolunteerProjectAnnouncementById(projectAnnouncementId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(projectAnnouncementId)) {
        reject(`projectAnnouncementId "${projectAnnouncementId}" passed is not a valid number`);
      }

      this.knex('volunteer_project_announcement').where('id', projectAnnouncementId).select().first()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  getAllVolunteerProjectAnnouncementsById(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('volunteer_project_announcement').where('volunteer_id', volunteerId).select()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get the project activity announcement by id
   * @param activiityId
   */
  getProjectActivityAnnouncement(activiityId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(activiityId)) {
        reject(`activiityId "${activiityId}" passed is not a valid number`);
      }

      this.knex('project_project_announcement').where('id', activiityId).select()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get all project activity announcements for a activity by id
   * @param projectId
   */
  getAllProjectActivityAnnouncementsByProjectId(projectActivityId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(projectActivityId)) {
        reject(`projectActivityId "${projectActivityId}" passed is not a valid number`);
      }

      this.knex('project_project_announcement').where('project_activity', projectActivityId).select()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Get a single announcement from the announcement table
   * @param annoucementId
   */
  getAnnouncementById(announcementId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(announcementId)) {
        reject(`projectActivityId "${announcementId}" passed is not a valid number`);
      }

      this.knex('announcement').where('id', announcementId).select()
        .then(comment => resolve(comment))
        .catch(error => reject(error));
    });
  }

  /**
   * Resolves the volunteers id if the username exists otherwise rejects.
   * @param username The username being checked
   */
  doesUsernameExist(username) {
    return new Promise((resolve, reject) => {
      if (!_.isString(username)) {
        reject(`volunteerId "${username}" passed is not a valid string`);
      }

      this.knex('volunteer').select('id').where('username', username).first()
        .then((result) => {
          if (_.isNil(result.id)) { reject(0); } else { resolve(result.id); }
        })
        .catch(() => reject(0));
    });
  }

  /**
   * Resolves the volunteers id if the email exists otherwise rejects.
   * @param email The email being checked
   */
  doesEmailExist(email) {
    return new Promise((resolve, reject) => {
      if (!_.isString(email)) {
        reject(`volunteerId "${email}" passed is not a valid string`);
      }

      this.knex('volunteer').select('id').where('email', email).first()
        .then((result) => {
          if (_.isNil(result.id)) { reject(0); } else { resolve(result.id); }
        })
        .catch(() => reject(0));
    });
  }

  /**
   * Updates a project by id with the provided content
   * @param id The id of the project
   * @param content The content in a object form that is being updated
   */
  updateProjectById(id, content) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(id)) {
        reject(`volunteerId "${id}" passed is not a valid number`);
      }

      this.knex('project').where('id', id).update(content)
        .then(updated => resolve(updated))
        .catch(error => reject(error));
    });
  }
}

module.exports = DatabaseWrapper;
