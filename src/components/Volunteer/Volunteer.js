const _ = require('lodash');
const Promise = require('bluebird');

const Database = require('../DatabaseWrapper/Database');
const logger = require('../Logger/Logger');

/**
 * Interface for everything that is needed for a volunteer
 */
class Volunteer extends Database {
  constructor(id = null, username = null) {
    super();
    this.doesExist = false;

    this.id = id;
    this.username = username;
    this.password = null;
    this.position = null;
    this.volunteerStatus = null;
    this.name = null;
    this.about = null;
    this.phone = null;
    this.location = null;
    this.timezone = null;
    this.linkedInId = null;
    this.slackId = null;
    this.githubId = null;
    this.isHatchling = null;
    this.developerLevel = null;
    this.adminPortalAccess = null;
    this.adminOverallLevel = null;
    this.verified = null;
    this.email = null;
    this.salt = null;
  }

  /**
   * Checks to see if the user already exists in the database under the provided type or default
   * of id, if the volunteer does already exist then it will update the username, email, password,
   * and salt that is being used in the class.
   */
  exists(type = 'id') {
    return new Promise((resolve, reject) => {
      this.knex('volunteer').where(type, this[type]).select('id', 'username', 'email', 'password', 'salt').first()
        .then((volunteer) => {
          if (_.isNil(volunteer)) {
            reject(false);
          } else {
            this.id = volunteer.id;
            this.username = volunteer.username;
            this.email = volunteer.email;
            this.password = volunteer.password;
            this.salt = volunteer.salt;
            this.doesExist = true;
            resolve(true);
          }
        })
        .catch((error) => {
          reject(`Failed to check if volunteer already exists, error=${JSON.stringify(error)}`);
        });
    });
  }

  /**
   * Creates the volunteer with the provided details.
   * @param name
   * @param username
   * @param email
   * @param password
   * @param dataEntryUserId
   */
  create(name, username, email, password, dataEntryUserId) {
    return new Promise((resolve, reject) => {
      const hashedPassword = this.saltAndHash(password);
      const date = new Date();

      const volunteer = Object.assign({
        name,
        username,
        email,
        data_entry_user_id: dataEntryUserId },
        {
          data_entry_date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
          password: hashedPassword.hashedPassword,
          salt: hashedPassword.salt,
        });

      this.knex('volunteer').insert(volunteer)
        .then((id) => {
          const code = this.createNewVerificationCode(id[0]);

          this.id = id[0];
          this.name = name;
          this.username = username;
          this.email = email;
          this.password = hashedPassword.hashedPassword;
          this.salt = hashedPassword.salt;

          resolve({ id: id[0], code });
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Marks the provided usersId as verified in the database
   */
  verify() {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(this.id)) {
        reject(`volunteerId "${this.id}" passed is not a valid number`);
      }

      this.knex('volunteer').where('id', this.id).update({ verified: true })
        .then(() => {
          this.verified = true;
          resolve();
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Generates a verification code that will be used in the email to generate the link. The link
   * when clicked will take them to a web page which will call down to the api to verify the code.
   *
   * When verifying the code, we will get the code and the username, check that its the correct
   * username, then salt the given code with the stored salt. Compare the newly salted code with
   * the stored already salted code, if they match we then mark the account as verified.
   */
  createVerificationCode() {
    const number = Math.floor((Math.random() * ((9999999999999 - 1000000000000) + 1000000000000)));
    const hashedNumber = this.saltAndHash(number.toString());
    const date = new Date();

    this.removeVerificationCode(parseInt(this.id, 10));

    this.knex('verification_codes').insert({
      id: this.id,
      code: hashedNumber.hashedPassword,
      salt: hashedNumber.salt,
      data_entry_date: date,
    })
      .then(() => logger.info(`Created verification Code for user ${this.id}, number=${number}`))
      .catch(error => logger.error(`Failed to create verification code for user ${this.id} error=${JSON.stringify(error)}`));

    return number;
  }

  /**
   * Removes the verification code by id for user
   */
  removeVerificationCode() {
    if (!_.isNumber(this.id)) {
      return `volunteerId "${this.id}" passed is not a valid number`;
    }

    return this.knex('verification_codes').where('id', this.id).del()
      .then()
      .catch(error => logger.error(`Failed to remove verification code for user ${this.id} error=${JSON.stringify(error)}`));
  }

  /**
   * Gets and returns all details for the volunteer in the verification codes table.
   */
  getVerificationCode() {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(this.id)) {
        reject(`volunteerId "${this.id}" passed is not a valid number`);
      }

      this.knex('verification_codes').where('id', this.id).first()
        .then(details => resolve(details))
        .catch(error => reject(error));
    });
  }

  /**
   * Resolves the volunteers id if the verification code exists exists otherwise rejects.
   */
  doesVerificationCodeExist() {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(this.id)) {
        reject(`volunteerId "${this.id}" passed is not a valid number`);
      }

      this.knex('volunteer').select('id').where('id', this.id).first()
        .then((result) => {
          if (_.isNil(result.id)) { reject(0); } else { resolve(result.id); }
        })
        .catch(() => reject(0));
    });
  }

  /**
   * Update the volunteers password with the new password, this process will do the salting and
   * hashing of the password, storing the new salt and new hashed password.
   * @param password
   */
  updatePassword(password) {
    return new Promise((resolve, reject) => {
      if (!_.isNumber(this.id) || !_.isString(password)) {
        reject('password or id passed was not a valid number or string');
      }

      const salted = this.saltAndHash(password);
      this.knex('volunteer').where('id', this.id).update({
        password: salted.hashedPassword,
        salt: salted.salt,
      })
        .then(() => resolve())
        .catch(error => reject(`Unable to update password for volunteer ${this.id}, error=${JSON.stringify(error)}`));
    });
  }
}

module.exports = Volunteer;
