import * as Promise from 'bluebird';
import * as _ from 'lodash';

import Configuration from './Configuration/Configuration';
import Database from './Database';

const config = new Configuration('mercury', 'mercury.json');

export interface IVolunteer {
  volunteer_id: number;
  username: string;
  password: string;
  position: string;
  volunteerStatus: string;
  name: string;
  about: string;
  phone: string;
  location: string;
  timezone: string;
  linkedInId: number;
  slackId: number;
  githubId: number;
  developerLevel: number;
  adminPortalAccess: boolean;
  adminOverallLevel: string;
  verified: boolean;
  email: string;
  salt: string;
}

export interface IVerificationCode {
  verification_code_id: number;
  code: string;
  created_datetime: Date;
  salt: string;
}

export interface IPasswordResetCode {
  password_reset_code_id: number;
  code: string;
  created_datetime: Date;
  salt: string;
}

export interface IAnnouncement {
  announcement_id: number;
  data_entry_user_id: number;
  title: string;
  body: string;
  announcement_type: string;
  created_datetime: Date;
  modified_datetime: Date;
}

export interface IVolunteerAnnouncement {
  volunteer_announcement_id: number;
  created_datetime: Date;
  data_entry_user_id: number;
  announcement: number;
  volunteer_id: number;
  read: boolean;
  read_date: Date;
}

export interface IToken {
  username: string;
  id: number;
}

export default class Volunteer extends Database {
  [key: string]: any;
  public username: string;
  public email: string;
  public name: string;
  public volunteerId: number;
  public password: string;
  public position: string;
  public volunteerStatus: string;
  public about: string;
  public phone: string;
  public location: string;
  public timezone: string;
  public linkedInId: number;
  public slackId: number;
  public githubId: number;
  public developerLevel: number;
  public adminPortalAccess: boolean;
  public adminOverallLevel: string;
  public verified: boolean;
  public salt: string;
  public doesExist: boolean;

  constructor(volunteerId?: number | null, username?: string) {
    if (!_.isNil(volunteerId) && !_.isInteger(volunteerId)) {
      throw new Error('When provided VolunteerId must be a integer');
    }
    if (!_.isNil(username) && !_.isString(username)) {
      throw new Error('When provided username must be a string');
    }

    super(config.getKey('database'));

    this.doesExist = false;

    this.volunteerId = volunteerId;
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
  public exists(type: string = 'volunteerId'): Promise<boolean | Error> {
    if (_.isNil(this[type])) {
      return Promise.reject(new Error(`Type must be defined or valid, type=${this[type]}`));
    }

    let selectType: string;

    if (type === 'volunteerId') {
      selectType = 'volunteer_id';
    } else {
      selectType = type;
    }

    return this.connect()
      .then(() => this.knex('volunteer')
      .where(selectType, this[type])
      .select('volunteer_id', 'username', 'email', 'password', 'salt', 'verified')
      .first())
      .then((volunteer: IVolunteer) => {
        if (_.isNil(volunteer)) {
          return Promise.reject(new Error(`Volunteer does not exist by type=${type}`));
        }
        this.volunteerId = volunteer.volunteer_id;
        this.username = volunteer.username;
        this.email = volunteer.email;
        this.password = volunteer.password;
        this.salt = volunteer.salt;
        this.verified = volunteer.verified;
        this.doesExist = true;
        return Promise.resolve(true);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Takes in the attempting users password and returns true or false if the details match.
   * @param password The password being used to attempt the login.
   * @returns {boolean}
   */
  public compareAuthenticatingPassword(password: string): boolean {
    if (_.isNil(password)) { return false; }
    const hashedPassword = this.saltAndHash(password, this.salt);
    return hashedPassword.hashedPassword === this.password;
  }

  /**
   * Creates the volunteer with the provided details.
   * @param password
   * @param dataEntryUserId
   */
  public create(password: string, dataEntryUserId: number = 1): Promise<number | Error> {
    if (_.isNil(this.name) || _.isNil(this.username) || _.isNil(this.email)) {
      return Promise.reject(
        new Error(`name, username, email and password are required, name=${this.name}, username=${this.username}, email=${this.email}`),
      );
    }

    if (_.isNil(password)) {
      return Promise.reject(new Error(`You must provide a password to create the volunteer=${this.username}`));
    }

    const hashedPassword: { salt: string, hashedPassword: string } = this.saltAndHash(password);
    const date: Date = new Date();

    const volunteer = {
      created_datetime: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      data_entry_user_id: dataEntryUserId,
      email: this.email,
      name: this.name,
      password: hashedPassword.hashedPassword,
      salt: hashedPassword.salt,
      username: this.username,
    };

    return this.connect()
      .then(() => this.knex('volunteer').insert(volunteer))
      .then((id) => {
        const { 0: volunteerId } = id;

        this.password = hashedPassword.hashedPassword;
        this.volunteerId = volunteerId;
        this.salt = hashedPassword.salt;

        const code = this.createVerificationCode();

        return Promise.resolve(code);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Marks the provided usersId as verified in the database
   */
  public verify(): Promise<boolean | Error> {
    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('volunteer').where('volunteer_id', this.volunteerId).update({ verified: true }))
      .then(() => {
        this.verified = true;
        return Promise.resolve(this.verified);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns true or false based on the verification of the user.
   * @returns {boolean}
   */
  public getVerification(): boolean {
    if (_.isNil(this.username)) {
      return false;
    }

    return this.verified;
  }

  /**
   * Returns the current user profile information, returns a empty string if its null / empty
   */
  public getProfile() {
    return {
      about: _.defaultTo(this.about, ''),
      developer_level: _.defaultTo(this.developerLevel, ''),
      email: _.defaultTo(this.email, ''),
      github_id: _.defaultTo(this.githubId, ''),
      linked_in_id: _.defaultTo(this.linkedInId, ''),
      location: _.defaultTo(this.location, ''),
      name: _.defaultTo(this.name, ''),
      phone: _.defaultTo(this.phone, ''),
      position: _.defaultTo(this.position, ''),
      slack_id: _.defaultTo(this.slackId, ''),
      timezone: _.defaultTo(this.timezone, ''),
      username: _.defaultTo(this.username, ''),
      verified: _.defaultTo(this.verified, ''),
      volunteer_id: _.defaultTo(this.volunteerId, ''),
      volunteer_status: _.defaultTo(this.volunteerStatus, ''),
    };
  }

  /**
   * Removes the verification code by id for user
   */
  public removeVerificationCode(): Promise<boolean | Error> {
    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('verification_code').where('verification_code_id', this.volunteerId).del())
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * removes the existing (if any) password reset codes for the user)
   */
  public removePasswordResetCode(): Promise<boolean | Error> {
    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('password_reset_code').where('password_reset_code_id', this.volunteerId).del())
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Gets and returns all details for the volunteer in the verification codes table.
   */
  public getVerificationCode(): Promise<IVerificationCode | Error> {
    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('verification_code').where('verification_code_id', this.volunteerId).first())
      .then((details: IVerificationCode) => Promise.resolve(details))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Gets the password reset code from the password_reset_code table if it exists
   */
  public getPasswordResetCode(): Promise<IPasswordResetCode | Error> {
    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('password_reset_code').where('password_reset_code_id', this.volunteerId).first())
      .then((details: IPasswordResetCode) => Promise.resolve(details))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Resolves the volunteers id if the verification code exists exists otherwise rejects.
   */
  public doesVerificationCodeExist(): Promise<number | Error> {
    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('verification_code').select('verification_code_id').where('verification_code_id', this.volunteerId).first())
      .then((result: IVerificationCode) => {
        if (_.isNil(result) || _.isNil(result.verification_code_id)) {
          return Promise.reject(new Error(`No verification code exists for user ${this.volunteerId}`));
        }
        return Promise.resolve(result.verification_code_id);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Resolves the volunteers id if the password code exists exists otherwise rejects.
   */
  public doesPasswordResetCodeExist(): Promise<number | Error> {
    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('password_reset_code')
      .select('password_reset_code_id')
      .where('password_reset_code_id', this.volunteerId)
      .first())
      .then((result: IPasswordResetCode) => {
        if (_.isNil(result) || _.isNil(result.password_reset_code_id)) {
          return Promise.reject(new Error(`No password reset code exists for user ${this.volunteerId}`));
        }
        return Promise.resolve(result.password_reset_code_id);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Update the volunteers password with the new password, this process will do the salting and
   * hashing of the password, storing the new salt and new hashed password.
   * @param password
   */
  public updatePassword(password: string): Promise<boolean | Error> {
    if (!_.isNumber(this.volunteerId) || !_.isString(password)) {
      return Promise.reject(new Error('password or id passed was not a valid number or string'));
    }

    const salted = this.saltAndHash(password);

    return this.connect()
      .then(() => this.knex('volunteer').where('volunteer_id', this.volunteerId).update({
        password: salted.hashedPassword,
        salt: salted.salt,
      }))
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Grabs all the volunteer announcement ids from the volunteer_announcement table and then
   * uses them ids to get all the announcements from the announcement table.
   * TODO: try this out and then write tests to cover the usages.
   */
  public getActiveNotifications(): Promise<IAnnouncement[] | Error> {
    return this.connect()
      .then(() => this.knex('volunteer_announcement')
      .where('volunteer_id', this.volunteerId)
      .andWhere('read', false)
      .select('announcement'))
      .then((announcementIds: IVolunteerAnnouncement[]) => {
        if (!_.isNil(announcementIds[0])) {
          const justIds = _.map(announcementIds, announcementId => announcementId.announcement);
          return this.knex('announcement').whereIn('announcement_id', justIds).select();
        }
        return Promise.resolve([]);
      })
      .then((announcements: IAnnouncement[]) => Promise.resolve(announcements))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Marks the passed volunteer_announcement id as read in the database, this will no
   * longer be returned once the user requests there notifications again.
   * @param announcementId The id of the notification to be marked as read.
   * TODO: this needs to be tried and tests written to cover usages.
   */
  public dismissNotification(announcementId: number): Promise<boolean | Error> {
    if (_.isNil(announcementId) || !_.isNumber(announcementId)) {
      return Promise.reject(new Error(`Announcement Id must be passed and also a valid number, announcement id=${announcementId}`));
    }

    if (!_.isNumber(this.volunteerId)) {
      return Promise.reject(new Error(`volunteerId "${this.volunteerId}" passed is not a valid number`));
    }

    return this.connect()
      .then(() => this.knex('volunteer_announcement').where({
        volunteer_announcement_id: announcementId,
        volunteer_id: this.volunteerId,
      }).update({
        read: true,
        read_date: new Date(),
      }))
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Can the volunteer access the admin panel
   */
  public canAccessAdminPortal(): Promise<boolean | Error> {
    if (_.isNil(this.adminPortalAccess)) {
      return this.connect()
      .then(() => this.knex('volunteer').select('admin_portal_access').where('volunteer_id', this.volunteerId).first())
      .then((res: { admin_portal_access: number }) => {
        this.adminPortalAccess = (res.admin_portal_access === 1) ? true : false;
        return Promise.resolve(this.adminPortalAccess);
      })
      .catch((error: Error) => Promise.reject(error));
    }
    return Promise.resolve(this.adminPortalAccess);
  }

  /**
   * Generates a verification code that will be used in the email to generate the link. The link
   * when clicked will take them to a web page which will call down to the api to verify the code.
   *
   * When verifying the code, we will get the code and the username, check that its the correct
   * username, then salt the given code with the stored salt. Compare the newly salted code with
   * the stored already salted code, if they match we then mark the account as verified.
   */
  public createVerificationCode(): Promise<number | Error> {
    const maxNumber: number = 9999999999999;
    const minNumber: number = 1000000000000;

    const number: number = Math.floor((Math.random() * ((maxNumber - minNumber) + 1000000000000)));
    const hashedNumber: { salt: string; hashedPassword: string; } = this.saltAndHash(number.toString());
    const date: Date = new Date();

    const verificationCode: IVerificationCode = {
      code: hashedNumber.hashedPassword,
      created_datetime: date,
      salt: hashedNumber.salt,
      verification_code_id: this.volunteerId,
    };

    return this.connect()
      .then(() => this.removeVerificationCode())
      .then(() => this.knex('verification_code').insert(verificationCode))
      .then(() => Promise.resolve(number))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Generates a password reset code that will be used in a click-able link to allow the user
   * to reset there password, the username, email, password and code will be passed down. If
   * the code matches the code in the database with the username nad email, then the new
   * password will be set (code is hashed and salted)
   */
  public createPasswordResetCode(): Promise<number | Error> {
    const maxNumber: number = 9999999999999;
    const minNumber: number = 1000000000000;

    const number: number = Math.floor((Math.random() * ((maxNumber - minNumber) + 1000000000000)));
    const hashedNumber: { salt: string; hashedPassword: string; } = this.saltAndHash(number.toString());
    const date: Date = new Date();

    const passwordResetCode: IPasswordResetCode = {
      code: hashedNumber.hashedPassword,
      created_datetime: date,
      password_reset_code_id: this.volunteerId,
      salt: hashedNumber.salt,
    };

    return this.connect()
      .then(() => this.removePasswordResetCode())
      .then(() => this.knex('password_reset_code').insert(passwordResetCode))
      .then(() => Promise.resolve(number))
      .catch((error: Error) => Promise.reject(error));
  }
}
