const _ = require('lodash');
const crypto = require('crypto');
const knex = require('knex');
const Promise = require('bluebird');

const logger = require('../Logger/Logger');

let instance = null;

class Database {
  constructor() {
    if (instance) {
      return instance;
    }

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
          logger.info('Successfully connected to knex: database');
        }
      })
      .catch((error) => {
        this.online = false;
        logger.error(`Could not connect to knex database, error=${JSON.stringify(error)}`);
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
   * Returns current online status
   * @returns {boolean}
   */
  getOnlineStatus() {
    return this.online;
  }
}

module.exports = Database;
