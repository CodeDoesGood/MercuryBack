const _ = require('lodash');
const crypto = require('crypto');
const knex = require('knex');
const Promise = require('bluebird');

const logger = require('../Logger/Logger');

let instance = null;

class DatabaseWrapper {
  constructor(filename) {
    if (instance) {
      return instance;
    }

    this.filename = filename;
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
    this.knex = knex({ client: 'sqlite3', connection: { filename: this.filename }, useNullAsDefault: true });

    return this.knex.raw('select 1+1 AS answer')
      .then(() => {
        if (this.showMessage) {
          logger.info(`Successfully connected to knex: database=${this.filename}`);
        }
      })
      .catch((error) => {
        this.online = false;
        logger.error(`Could not connect to knex database=${this.filename}, error=${JSON.stringify(error)}`);
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
   * Gets volunteer login details by username or id, but if you pass the id, you will have to make
   * sure that its passed as number and not a string
   * @param volunteerIdOrUsername The username (string) or volunteerId (number);
   */
  getVolunteerLoginDetails(volunteerIdOrUsername) {
    let searchType = 'id';

    if (_.isString(volunteerIdOrUsername)) { searchType = 'username'; }

    return new Promise((resolve, reject) => {
      this.knex('volunteer').where(searchType, volunteerIdOrUsername).select('id', 'password', 'salt').first()
        .then(volunteer => resolve(volunteer))
        .catch(error => reject(error));
    });
  }

  /**
   * Gets and returns all details for a single user in the verification codes table.
   * @param volunteerId The user id of the user to get from the table.
   */
  getVerificationCode(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('verification_codes').where('id', volunteerId).first()
        .then(details => resolve(details))
        .catch(error => reject(error));
    });
  }

  /**
   * Get the volunteers position details from the position table
   * @param volunteerId
   */
  getVolunteerPosition(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('position').where('id', volunteerId).select('name', 'description', 'value').first()
        .then(position => resolve(position))
        .catch(error => reject(error));
    });
  }

  /**
   * Gets all the current assignments for that volunteer by id
   * @param volunteerId
   */
  getVolunteerAssignments(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('volunteer_assignment').where('id', volunteerId).select().first()
        .then(assignments => resolve(assignments))
        .catch(error => reject(error));
    });
  }

  /**
   * Get all the volunteers comments by id
   * @param volunteerId
   */
  getVolunteerComments(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('volunteer_comment').where('id', volunteerId).select().first()
        .then(comments => resolve(comments))
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
   * Resolves the volunteers id if the verification code exists exists otherwise rejects.
   * @param volunteerId The volunteerId being checked
   */
  doesVerificationCodeExist(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('volunteer').select('id').where('id', volunteerId).first()
        .then((result) => {
          if (_.isNil(result.id)) { reject(0); } else { resolve(result.id); }
        })
        .catch(() => reject(0));
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

      this.knex('volunteer').select('id').where('email_address', email).first()
        .then((result) => {
          if (_.isNil(result.id)) { reject(0); } else { resolve(result.id); }
        })
        .catch(() => reject(0));
    });
  }

  /**
   * Creates a new volunteer in the volunteer table.
   * @param volunteerDetails All the required not null values for the volunteers table.
   */
  createNewVolunteer(volunteerDetails) {
    return new Promise((resolve, reject) => {
      const date = new Date();
      const hashedPassword = this.saltAndHash(volunteerDetails.password);

      const volunteer = Object.assign(volunteerDetails, {
        data_entry_date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
        data_entry_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        password: hashedPassword.hashedPassword,
        salt: hashedPassword.salt,
      });

      this.knex('volunteer').insert(volunteer)
        .then((id) => {
          const code = this.createNewVerificationCode(id[0]);
          resolve({ id: id[0], code });
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Marks the provided usersId as email verified in the database
   * @param volunteerId The volunteerId of the user being verified.
   */
  markVolunteerAsVerified(volunteerId) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(volunteerId)) {
        reject(`volunteerId "${volunteerId}" passed is not a valid number`);
      }

      this.knex('volunteer').where('id', volunteerId).update({
        verified: true,
      })
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  /**
   * Salts then hashes the password 28000 times
   * @param password The password being salted and hashed.
   * @param passedSalt can override generate salt for authentication checking
   * @return {{salt, hashedPassword}} A object containg the salt and salted / hashed password to be
   * stored.
   */
  saltAndHash(passedPassword, passedSalt = null) {
    let salt = passedSalt;
    let password = passedPassword;

    if (_.isNil(salt)) { salt = crypto.randomBytes(128).toString('base64'); }
    if (!_.isString(password)) { password = password.toString(); }

    const hashedPassword = crypto.pbkdf2Sync(password, salt, this.iterations, 512, 'sha512').toString('hex');

    return {
      salt,
      hashedPassword,
    };
  }

  /**
   * Compares users password with stored password after salting.
   * @param volunteerPassword The password being salted.
   * @param storedPassword The stored password.
   * @param salt The stored salt.
   * @returns {boolean} true if matched.
   */
  compareVolunteerLoggingInPasswords(volunteerPassword, storedPassword, salt) {
    const hashedPassword = this.saltAndHash(volunteerPassword, salt);
    return hashedPassword.hashedPassword === storedPassword;
  }


  /**
   * Generates a verification code that will be used in the email to generate the link. The link
   * when clicked will take them to a web page which will call down to the api to verify the code.
   *
   * When verifying the code, we will get the code and the username, check that its the correct
   * username, then salt the given code with the stored salt. Compare the newly salted code with
   * the stored already salted code, if they match we then mark the account as verified.
   *
   * @param volunteerId The user id that will be bound to.
   * @returns {number} The code generated
   */
  createNewVerificationCode(volunteerId) {
    const number = Math.floor((Math.random() * ((9999999999999 - 1000000000000) + 1000000000000)));
    const hashedNumber = this.saltAndHash(number.toString());
    const date = new Date();

    this.removeVerificationCode(volunteerId);

    this.knex('verification_codes').insert({
      id: volunteerId,
      code: hashedNumber.hashedPassword,
      salt: hashedNumber.salt,
      data_entry_date: date,
    })
      .then(() => logger.info(`Created verification Code for user ${volunteerId}, number=${number}`))
      .catch(error => logger.error(`Failed to create verification code for user ${volunteerId} error=${JSON.stringify(error)}`));

    return number;
  }

  /**
   * Removes the verification code by id for user
   * @param volunteerId The id of the user where the email verification code is being removed
   */
  removeVerificationCode(volunteerId) {
    if (!_.isNumber(volunteerId)) {
      return `volunteerId "${volunteerId}" passed is not a valid number`;
    }

    return this.knex('verification_codes').where('id', volunteerId).del()
      .then()
      .catch(error => logger.error(`Failed to remove verification code for user ${volunteerId} error=${JSON.stringify(error)}`));
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

  /**
   * Updates a volunteer password by id.
   * @param id The id of the volunteer.
   * @param password The password being updated.
   */
  updateVolunteerPasswordById(id, password) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(id) || !_.isString(password)) {
        reject('password or id passed was not a valid number or string');
      }

      const salted = this.saltAndHash(password);
      this.knex('volunteer').where('id', id).update({
        password: salted.hashedPassword,
        salt: salted.salt,
      })
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  /**
   * Returns current online status
   * @returns {boolean}
   */
  getOnlineStatus() {
    return this.online;
  }
}

module.exports = DatabaseWrapper;
