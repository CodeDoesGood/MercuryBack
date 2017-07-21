const knex = require('knex');
const Promise = require('bluebird');
const _ = require('lodash');
const crypto = require('crypto');

const logger = require('../Logger/Logger');

let instance = null;

class DatabaseWrapper {
  constructor(filename) {
    if (instance) {
      return instance;
    }

    this.filename = filename;
    this.online = false;
    this.iterations = 28000;

    this.connect();

    instance = this;
  }

  /**
   * Makes a connection to the postgres database
   * @returns {Promise.<T>}
   */
  connect() {
    this.knex = knex({ client: 'sqlite3', connection: { filename: this.filename }, useNullAsDefault: true });

    return this.knex.raw('select 1+1 AS answer')
      .then(() => {
        this.online = true;
        logger.info(`Successfully connected to knex: database=${this.filename}`);
      })
      .catch((error) => {
        logger.error(`Could not connect to knex database=${this.filename}, error=${JSON.stringify(error)}`);
      });
  }

  /**
   * Returns the project based on id
   * @param id
   */
  getProjectById(id) {
    return new Promise((resolve, reject) => {
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
      this.knex('project').where('status', 'active')
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
   * returns the id, password and salt for the volunteer being logged in.
   * @param userId The use id of the user being logged in.
   */
  getVolunteerLoginDetails(userId) {
    return new Promise((resolve, reject) => {
      this.knex('volunteer').where('id', userId).select('id', 'password', 'salt').first()
        .then(volunteer => resolve(volunteer))
        .catch(error => reject(error));
    });
  }

  /**
   * Gets and returns all details for a single user in the verification codes table.
   * @param userId The user id of the user to get from the table.
   */
  getVerificationCode(userId) {
    return new Promise((resolve, reject) => {
      this.knex('verification_codes').where('id', userId).first()
        .then(details => resolve(details))
        .catch(error => reject(error));
    });
  }

  /**
   * Resolves the volunteers id if the verification code exists exists otherwise rejects.
   * @param userId The userId being checked
   */
  doesVerificationCodeExist(userId) {
    return new Promise((resolve, reject) => {
      this.knex('volunteer').select('id').where('id', userId).first()
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
   * @param userId The userId of the user being verified.
   */
  markVolunteerAsVerified(userId) {
    return new Promise((resolve, reject) => {
      this.knex('volunteer').where('id', userId).update({
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
   * Generates a verification code that will be used in the email to generate the link. The link
   * when clicked will take them to a web page which will call down to the api to verify the code.
   *
   * When verifying the code, we will get the code and the username, check that its the correct
   * username, then salt the given code with the stored salt. Compare the newly salted code with
   * the stored already salted code, if they match we then mark the account as verified.
   *
   * @param userId The user id that will be bound to.
   * @returns {number} The code generated
   */
  createNewVerificationCode(userId) {
    const number = Math.floor((Math.random() * ((9999999999999 - 1000000000000) + 1000000000000)));
    const hashedNumber = this.saltAndHash(number.toString());
    const date = new Date();

    this.removeVerificationCode(userId);

    this.knex('verification_codes').insert({
      id: userId,
      code: hashedNumber.hashedPassword,
      salt: hashedNumber.salt,
      data_entry_date: date,
    })
      .then(() => logger.info(`Created verification Code for user ${userId}, number=${number}`))
      .catch(error => logger.error(`Failed to create verification code for user ${userId} error=${JSON.stringify(error)}`));

    return number;
  }

  /**
   * Removes the verification code by id for user
   * @param userId The id of the user where the email verification code is being removed
   */
  removeVerificationCode(userId) {
    this.knex('verification_codes').where('id', userId).del()
      .then()
      .catch(error => logger.error(`Failed to remove verification code for user ${userId} error=${JSON.stringify(error)}`));
  }

  /**
   * Updates a project by id with the provided content
   * @param id The id of the project
   * @param content The content in a object form that is being updated
   */
  updateProjectById(id, content) {
    return new Promise((resolve, reject) => {
      this.knex('project').where('id', id).update(content)
        .then(updated => resolve(updated))
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
