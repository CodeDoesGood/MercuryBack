import * as _ from 'lodash';

import { Configuration } from './configuration';
import { Database } from './database';

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

export class User extends Database {
  [key: string]: any;
  public username: string;
  public email: string;
  public name: string;
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
  public userId: number;

  constructor(userId?: number, username?: string) {
    super(config.getKey('database'));

    this.userId = userId;
    this.username = username;
    this.doesExist = false;
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

  public async existsById(): Promise<boolean> {
    if (_.isNil(this.userId)) {
      return Promise.reject(new Error(`userId is null or undefined while attempt to check existence`));
    }

    return this.knex('volunteer')
      .where('volunteer_id', this.userId)
      .select('volunteer_id', 'username', 'email', 'password', 'salt', 'verified')
      .first()
      .then((volunteer: IVolunteer) => {
        if (_.isNil(volunteer)) {
          throw new Error(`User does not exist by id`);
        }
        return this.setVolunteerContent(volunteer);
      })
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  public async existsByUsername(): Promise<boolean> {
    if (_.isNil(this.username)) {
      return Promise.reject(new Error(`username is null or undefined while attempt to check existence`));
    }

    return this.knex('volunteer')
      .where('username', this.username)
      .select('volunteer_id', 'username', 'email', 'password', 'salt', 'verified')
      .first()
      .then((volunteer: IVolunteer) => this.setVolunteerContent(volunteer))
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  public async setVolunteerContent(volunteer: IVolunteer): Promise<void> {
    this.userId = volunteer.volunteer_id;
    this.username = volunteer.username;
    this.email = volunteer.email;
    this.password = volunteer.password;
    this.salt = volunteer.salt;
    this.verified = volunteer.verified;
    this.doesExist = true;
    return Promise.resolve();
  }

  public setName = (name: string) => this.name = name;
  public setEmail = (email: string) => this.email = email;

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
      volunteer_id: _.defaultTo(this.userId, ''),
      volunteer_status: _.defaultTo(this.volunteerStatus, ''),
    };
  }

  public getVerification = (): boolean => this.verified;
  public getId = (): number => this.userId;
  public getUsername = (): string => this.username;
}
