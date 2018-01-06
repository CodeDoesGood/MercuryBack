import * as Promise from 'bluebird';
import * as crypto from 'crypto';
import * as knex from 'knex';
import * as _ from 'lodash';

import { IVolunteer } from './Volunteer';

export interface IDatabaseConfig {
  client: string;
  connection: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  pool: {
    min: number;
    max: number;
  };
}

export default class Database {
  public knex: knex;
  public online: boolean;
  public config: IDatabaseConfig;

  private interation: number;

  constructor(config: IDatabaseConfig) {
    this.config = config;
    this.online = false;
    this.interation = 28000;

    this.connect()
      .then(() => undefined)
      .catch((error: Error) => { throw error; });
  }

  /**
   * Makes a connection to the sql database
   */
  public connect(): Promise<boolean | Error> {
    if (this.online) {
      return Promise.resolve(this.online);
    }

    this.knex = knex(this.config);

    return this.knex.raw('select 1+1 as answer')
      .then(() => {
        this.online = true;
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        this.online = false;
        return Promise.reject(error);
      });
  }

  /**
   * Salts then hashes the password 28000 times
   * @param passedPassword The password being salted and hashed.
   * @param passedSalt can override generate salt for authentication checking
   * @return {{salt, hashedPassword}} A object containing the salt and salted / hashed password
   * to be stored.
   */
  public saltAndHash(passedPassword: string, passedSalt: string = null): { salt: string, hashedPassword: string } {
    let salt: string = passedSalt;
    let password: string = passedPassword;

    if (_.isNil(salt)) { salt = crypto.randomBytes(128).toString('base64'); }
    if (!_.isString(password)) { password = `${password}`; }

    const hashedPassword: string = crypto.pbkdf2Sync(password, salt, this.interation, 512, 'sha512').toString('hex');

    return {
      hashedPassword,
      salt,
    };
  }

  /**
   * Resolves the volunteers id if the username exists otherwise rejects.
   * @param username The username being checked
   */
  public doesUsernameExist(username: string): Promise<number | Error> {
    if (!_.isString(username)) {
      return Promise.reject(new Error(`volunteerId "${username}" passed is not a valid string`));
    }

    return this.knex('volunteer').select('volunteer_id').where('username', username).first()
      .then((result: IVolunteer) => Promise.resolve(result.volunteer_id))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Resolves the volunteers id if the email exists otherwise rejects.
   * @param email The email being checked
   */
  public doesEmailExist(email: string): Promise<number | Error> {
    if (!_.isString(email)) {
      return Promise.reject(new Error(`email "${email}" passed is not a valid string`));
    }

    return this.knex('volunteer').select('volunteer_id').where('email', email).first()
      .then((result: IVolunteer) => {
        if (!_.isNil(result)) {
          return Promise.resolve(result.volunteer_id);
        }
        return Promise.reject(new Error('Email does not exist'));
      })
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns current online status
   * @returns {boolean}
   */
  public getOnlineStatus(): boolean {
    return this.online;
  }

  /**
   * Update the database password stored.
   * @param password Password for database pool
   */
  public setDatabasePassword(password: string): void {
    this.config.connection.password = password;
  }
}
