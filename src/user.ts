import * as _ from 'lodash';

import { Configuration } from './configuration';
import { Database } from './database';

const config = new Configuration();

export interface IVolunteer {
  volunteer_id: number;
  username: string;
  password: string;
  position: string;
  volunteerStatus: string;
  volunteer_status: string;
  name: string;
  about: string;
  phone: string;
  location: string;
  timezone: string;
  linkedInId: number;
  slackId: string;
  githubId: string;
  github_id: string;
  slack_id: string;
  twitter_id: string;
  linked_in_id: string;
  picture_url: string;
  developerLevel: number;
  developer_Level: number;
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
  public linkedInId: string;
  public pictureUrl: string;
  public slackId: string;
  public githubId: string;
  public twitterId: string;
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
    this.twitterId = null;
    this.pictureUrl = null;
    this.developerLevel = null;
    this.adminPortalAccess = null;
    this.adminOverallLevel = null;
    this.verified = false;
    this.email = null;
    this.salt = null;
  }

  public async getCompleteProfile() {
    if (_.isNil(this.userId)) {
      return Promise.reject(new Error(`userId is null or undefined while attempt to check existence`));
    }

    // TODO Will need to merge position_id with a join with the correct position of the volunteer
    return this.knex('volunteer')
      .where('volunteer_id', this.userId)
      .select(
        'about', 'developer_level', 'email', 'github_id', 'linked_in_id', 'twitter_id', 'location', 'picture_url',
        'name', 'phone', 'position_id', 'slack_id', 'timezone', 'username', 'verified', 'volunteer_status')
      .first()
      .then((volunteer: IVolunteer) => this.setVolunteerContent(volunteer))
      .then(() => Promise.resolve(this.getProfile()))
      .catch((error: Error) => Promise.reject(error));
  }
  /**
   * Used the userId to check to see if it exists and returns the volunteer details, which are
   * volunteer_id, username, email, password, salt and verified
   */
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

  /**
   * Repeats the same as existsById but by using this.username instead
   */
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

  /**
   * Sets the content for the volunteer object of a IVounteer content
   * @param volunteer IVolunteer object containing the basic volunteer content
   */
  public async setVolunteerContent(volunteer: IVolunteer): Promise<void> {
    this.userId = volunteer.volunteer_id;
    this.salt = volunteer.salt;
    this.password = volunteer.password;
    this.about = volunteer.about;
    this.developerLevel = volunteer.developer_Level;
    this.email = volunteer.email;
    this.githubId = volunteer.github_id;
    this.twitterId = volunteer.twitter_id;
    this.linkedInId = volunteer.linked_in_id;
    this.pictureUrl = volunteer.picture_url;
    this.location = volunteer.location;
    this.name = volunteer.name;
    this.phone = volunteer.phone;
    this.position = volunteer.position;
    this.slackId = volunteer.slack_id;
    this.timezone = volunteer.timezone;
    this.username = volunteer.username;
    this.verified = volunteer.verified;
    this.volunteerStatus = volunteer.volunteer_status;
    this.doesExist = true;
    return Promise.resolve();
  }

  // Setters
  public setName = (name: string) => this.name = name;
  public setEmail = (email: string) => this.email = email;

  // Getters
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
      picture_url: _.defaultTo(this.pictureUrl, ''),
      position: _.defaultTo(this.position, ''),
      slack_id: _.defaultTo(this.slackId, ''),
      timezone: _.defaultTo(this.timezone, ''),
      twitter_id: _.defaultTo(this.twitterId, ''),
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
