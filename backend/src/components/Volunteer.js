const _ = require('lodash');
const Promise = require('bluebird');

const ConfigurationWrapper = require('./Configuration/ConfigurationWrapper');
const Database = require('./DatabaseWrapper');

const config = new ConfigurationWrapper('mercury', 'mercury.json');

/**
 * Interface for everything that is needed for a volunteer
 */
class Volunteer extends Database {
  constructor(VolunteerId = null, username = null) {
    if (!_.isNil(VolunteerId) && !_.isInteger(VolunteerId)) {
      throw new Error('When provided VolunteerId must be a integer');
    }
    if (!_.isNil(username) && !_.isString(username)) {
      throw new Error('When provided username must be a integer');
    }

    super(config.getKey('database'));
    this.doesExist = false;

    this.volunteer_id = VolunteerId;
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
    this.developerLevel = null;
    this.adminPortalAccess = null;
    this.adminOverallLevel = null;
    this.verified = false;
    this.email = null;
    this.salt = null;
  }

  /**
   * Checks to see if the user already exists in the database under the provided type or default
   * of id, if the volunteer does already exist then it will update the username, email, password,
   * and salt that is being used in the class.
   */
  exists(type = 'volunteer_id') {
    if (_.isNil(this[type])) {
      return Promise.reject(`Type must be defined or valid, type=${this[type]}`);
    }

    return this.connect()
      .then(() => this.knex('volunteer').where(type, this[type]).select('volunteer_id', 'username', 'email', 'password', 'salt', 'verified').first())
      .then((volunteer) => {
        if (_.isNil(volunteer)) {
          return Promise.reject(`Volunteer does not exist by type=${type}`);
        }
        this.volunteer_id = volunteer.volunteer_id;
        this.username = volunteer.username;
        this.email = volunteer.email;
        this.password = volunteer.password;
        this.salt = volunteer.salt;
        this.verified = volunteer.verified;
        this.doesExist = true;
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Takes in the attempting users password and returns true or false if the details match.
   * @param password The password being used to attempt the login.
   * @returns {boolean}
   */
  compareAuthenticatingPassword(password) {
    if (_.isNil(password)) { return false; }
    const hashedPassword = this.saltAndHash(password, this.salt);
    return hashedPassword.hashedPassword === this.password;
  }

  /**
   * Creates the volunteer with the provided details.
   * @param password
   * @param dataEntryUserId
   */
  create(password, dataEntryUserId = 1) {
    if (_.isNil(this.name) || _.isNil(this.username) || _.isNil(this.email)) {
      return Promise.reject(`name, username, email and password are required, name=${this.name}, username=${this.username}, email=${this.email}`);
    } else if (_.isNil(password)) {
      return Promise.reject(`You must provide a password to create the volunteer=${this.username}`);
    }

    const hashedPassword = this.saltAndHash(password);
    const date = new Date();

    const volunteer = {
      name: this.name,
      username: this.username,
      email: this.email,
      data_entry_user_id: dataEntryUserId,
      created_datetime: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      password: hashedPassword.hashedPassword,
      salt: hashedPassword.salt,
    };

    return this.connect()
      .then(() => this.knex('volunteer').insert(volunteer))
      .then((id) => {
        const code = this.createVerificationCode();
        const { 0: volunteerId } = id;

        this.volunteer_id = volunteerId;
        this.password = hashedPassword.hashedPassword;
        this.salt = hashedPassword.salt;

        return Promise.resolve(code);
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Marks the provided usersId as verified in the database
   */
  verify() {
    if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('volunteer').where('volunteer_id', this.volunteer_id).update({ verified: true }))
      .then(() => {
        this.verified = true;
        return Promise.resolve();
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns true or false based on the verification of the user.
   * @returns {boolean}
   */
  getVerification() {
    if (_.isNil(this.username)) {
      return false;
    } else if (this.verified) {
      return true;
    }
    return false;
  }

  /**
   * Returns the current user profile information, returns a empty string if its null / empty
   */
  getProfile() {
    return {
      volunteer_id: _.defaultTo(this.volunteer_id, ''),
      username: _.defaultTo(this.username, ''),
      position: _.defaultTo(this.position, ''),
      email: _.defaultTo(this.email, ''),
      volunteer_status: _.defaultTo(this.volunteerStatus, ''),
      name: _.defaultTo(this.name, ''),
      about: _.defaultTo(this.about, ''),
      phone: _.defaultTo(this.phone, ''),
      location: _.defaultTo(this.location, ''),
      timezone: _.defaultTo(this.timezone, ''),
      linked_in_id: _.defaultTo(this.linkedInId, ''),
      slack_id: _.defaultTo(this.slackId, ''),
      github_id: _.defaultTo(this.githubId, ''),
      developer_level: _.defaultTo(this.developerLevel, ''),
      verified: _.defaultTo(this.verified, ''),
    };
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
    const maxNumber = 9999999999999;
    const minNumber = 1000000000000;

    const number = Math.floor((Math.random() * ((maxNumber - minNumber) + 1000000000000)));
    const hashedNumber = this.saltAndHash(number.toString());
    const date = new Date();


    return this.connect()
      .then(() => this.removeVerificationCode())
      .then(() => this.knex('verification_code').insert({
        verification_code_id: this.volunteer_id,
        code: hashedNumber.hashedPassword,
        salt: hashedNumber.salt,
        created_datetime: date,
      }))
      .then(() => Promise.resolve(number))
      .catch(error => Promise.reject(error));
  }

  /**
   * Generates a password reset code that will be used in a click-able link to allow the user
   * to reset there password, the username, email, password and code will be passed down. If
   * the code matches the code in the database with the username nad email, then the new
   * password will be set (code is hashed and salted)
   */
  createPasswordResetCode() {
    const maxNumber = 9999999999999;
    const minNumber = 1000000000000;

    const number = Math.floor((Math.random() * ((maxNumber - minNumber) + 1000000000000)));
    const hashedNumber = this.saltAndHash(number.toString());
    const date = new Date();


    return this.connect()
      .then(() => this.removePasswordResetCode())
      .then(() => this.knex('password_reset_code').insert({
        password_reset_code_id: this.volunteer_id,
        code: hashedNumber.hashedPassword,
        salt: hashedNumber.salt,
        created_datetime: date,
      }))
      .then(() => Promise.resolve(number))
      .catch(error => Promise.reject(error));
  }

  /**
   * Removes the verification code by id for user
   */
  removeVerificationCode() {
    if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('verification_code').where('verification_code_id', this.volunteer_id).del())
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error));
  }

  /**
   * removes the existing (if any) password reset codes for the user)
   */
  removePasswordResetCode() {
    if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('password_reset_code').where('password_reset_code_id', this.volunteer_id).del())
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error));
  }

  /**
   * Gets and returns all details for the volunteer in the verification codes table.
   */
  getVerificationCode() {
    if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('verification_code').where('verification_code_id', this.volunteer_id).first())
      .then(details => Promise.resolve(details))
      .catch(error => Promise.reject(error));
  }

  /**
   * Gets the password reset code from the password_reset_code table if it exists
   */
  getPasswordResetCode() {
    if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('password_reset_code').where('password_reset_code_id', this.volunteer_id).first())
      .then(details => Promise.resolve(details))
      .catch(error => Promise.reject(error));
  }


  /**
   * Resolves the volunteers id if the verification code exists exists otherwise rejects.
   */
  doesVerificationCodeExist() {
    if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('verification_code').select('verification_code_id').where('verification_code_id', this.volunteer_id).first())
      .then((result) => {
        if (_.isNil(result) || _.isNil(result.verification_code_id)) {
          return Promise.reject(`No verification code exists for user ${this.volunteer_id}`);
        }
        return Promise.resolve(result.verification_code_id);
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Resolves the volunteers id if the password code exists exists otherwise rejects.
   */
  doesPasswordResetCodeExist() {
    if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('password_reset_code').select('password_reset_code_id').where('password_reset_code_id', this.volunteer_id).first())
      .then((result) => {
        if (_.isNil(result) || _.isNil(result.password_reset_code_id)) {
          return Promise.reject(`No password reset code exists for user ${this.volunteer_id}`);
        }
        return Promise.resolve(result.password_reset_code_id);
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Update the volunteers password with the new password, this process will do the salting and
   * hashing of the password, storing the new salt and new hashed password.
   * @param password
   */
  updatePassword(password) {
    if (!_.isNumber(this.volunteer_id) || !_.isString(password)) {
      return Promise.reject('password or id passed was not a valid number or string');
    }

    const salted = this.saltAndHash(password);

    return this.connect()
      .then(() => this.knex('volunteer').where('volunteer_id', this.volunteer_id).update({
        password: salted.hashedPassword,
        salt: salted.salt,
      }))
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error));
  }

  /**
   * Grabs all the volunteer announcement ids from the volunteer_announcement table and then
   * uses them ids to get all the announcements from the announcement table.
   * TODO: try this out and then write tests to cover the usages.
   */
  getActiveNotifications() {
    return this.connect()
      .then(() => this.knex('volunteer_announcement').where('volunteer_id', this.volunteer_id).andWhere('read', false).select('announcement'))
      .then((announcementIds) => {
        if (!_.isNil(announcementIds[0])) {
          const justIds = _.map(announcementIds, announcementId => announcementId.announcement);
          return this.knex('announcement').whereIn('announcement_id', justIds).select();
        }
        return Promise.resolve([]);
      })
      .then(announcements => Promise.resolve(announcements))
      .catch(error => Promise.reject(error));
  }

  /**
   * Marks the passed volunteer_announcement id as read in the database, this will no
   * longer be returned once the user requests there notifications again.
   * @param announcementId The id of the notification to be marked as read.
   * TODO: this needs to be tried and tests written to cover usages.
   */
  dismissNotification(announcementId) {
    if (_.isNil(announcementId) || !_.isNumber(announcementId)) {
      return Promise.reject(`Announcement Id must be passed and also a valid number, announcement id=${announcementId}`);
    } else if (!_.isNumber(this.volunteer_id)) {
      return Promise.reject(`volunteerId "${this.volunteer_id}" passed is not a valid number`);
    }

    return this.connect()
      .then(() => this.knex('volunteer_announcement').where({
        volunteer_announcement_id: announcementId,
        volunteer_id: this.volunteer_id,
      }).update({
        read: true,
        read_date: new Date(),
      }))
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error));
  }
}

module.exports = Volunteer;
