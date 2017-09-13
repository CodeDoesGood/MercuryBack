const _ = require('lodash');
const crypto = require('crypto');
const knex = require('knex');
const Promise = require('bluebird');

const logger = require('../Logger/Logger');

class Database {
  constructor() {
    this.online = false;
    this.interation = 28000;
  }
  /**
   * Makes a connection to the database
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.online) {
        resolve();
      } else {
        this.knex = knex({
          client: 'mysql',
          connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'password',
            database: 'mercury',
          },
        });

        this.knex.raw('select 1+1 AS answer')
          .then(() => {
            this.online = true;
            resolve();
          })
          .catch((error) => {
            logger.error(`failed to connect to the database, error=${error}`);
            reject(error);
          });
      }
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
    return new Promise((resolve, reject) => {
      if (!_.isString(username)) {
        reject(`volunteerId "${username}" passed is not a valid string`);
      }

      this.connect()
        .then(() => this.knex('volunteer').select('volunteer_id').where('username', username).first())
        .then((result) => {
          if (_.isNil(result.volunteer_id)) { reject(0); } else { resolve(result.volunteer_id); }
        })
        .catch((error) => {
          reject(error);
        });
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

      this.connect()
        .then(() => this.knex('volunteer').select('volunteer_id').where('email', email).first())
        .then((result) => {
          if (_.isNil(result.id)) { reject(0); } else { resolve(result.id); }
        })
        .catch(() => reject(0));
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

module.exports = Database;
