const _ = require('lodash');
const crypto = require('crypto');
const knex = require('knex');
const Promise = require('bluebird');

class Database {
  constructor(info) {
    this.info = info;
    this.online = false;
    this.interation = 28000;
  }
  /**
   * Makes a connection to the database
   */
  connect() {
    if (this.online) {
      return Promise.resolve();
    }
    this.knex = knex(this.info);

    return this.knex.raw('select 1+1 AS answer')
      .then(() => {
        this.online = true;
        return Promise.resolve();
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Salts then hashes the password 28000 times
   * @param passedPassword The password being salted and hashed.
   * @param passedSalt can override generate salt for authentication checking
   * @return {{salt, hashedPassword}} A object containing the salt and salted / hashed password
   * to be stored.
   */
  saltAndHash(passedPassword, passedSalt = null) {
    let salt = passedSalt;
    let password = passedPassword;

    if (_.isNil(salt)) { salt = crypto.randomBytes(128).toString('base64'); }
    if (!_.isString(password)) { password = password.toString(); }

    const hashedPassword = crypto.pbkdf2Sync(password, salt, this.interation, 512, 'sha512').toString('hex');

    return {
      salt,
      hashedPassword,
    };
  }

  /**
   * Resolves the volunteers id if the username exists otherwise rejects.
   * @param username The username being checked
   */
  doesUsernameExist(username) {
    if (!_.isString(username)) {
      return Promise.reject(`volunteerId "${username}" passed is not a valid string`);
    }

    return this.connect()
      .then(() => this.knex('volunteer').select('volunteer_id').where('username', username).first())
      .then(result => Promise.resolve(result.volunteer_id))
      .catch(error => Promise.reject(error));
  }

  /**
   * Resolves the volunteers id if the email exists otherwise rejects.
   * @param email The email being checked
   */
  doesEmailExist(email) {
    if (!_.isString(email)) {
      return Promise.reject(`email "${email}" passed is not a valid string`);
    }

    return this.connect()
      .then(() => this.knex('volunteer').select('volunteer_id').where('email', email).first())
      .then(result => Promise.resolve(result.volunteer_id))
      .catch(() => Promise.reject(0));
  }

  /**
   * Returns current online status
   * @returns {boolean}
   */
  getOnlineStatus() {
    return this.online;
  }
}

module.exports = Database;
