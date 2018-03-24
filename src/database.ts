import * as knex from 'knex';
import * as _ from 'lodash';

import { IVolunteer } from './user';

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

export class Database {
  public knex: knex;
  public online: boolean;
  public config: IDatabaseConfig;

  constructor(config: IDatabaseConfig) {
    this.online = false;
    this.config = config;
    this.knex = knex(config);

    if (_.isNil(process.env.TRAVIS)) {
      this.connect()
        .then(() => (this.online = true))
        .catch((error: Error) => {
          throw error;
        });
    }
  }

  /**
   * Makes a connection to the sql database using knex
   */
  public async connect(): Promise<boolean> {
    return this.knex
      .raw('select 1+1 as answer')
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Checks to see if the email is already marked as used
   * @param email the email address to check to see if it exists for a already existing user
   */
  public async doesEmailExist(email: string): Promise<number> {
    if (!_.isString(email)) {
      return Promise.reject(new Error(`email "${email}" passed is not a valid string`));
    }

    return this.knex('volunteer')
      .select('volunteer_id')
      .where('email', email)
      .first()
      .then((result: IVolunteer) => Promise.resolve(result.volunteer_id))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Checks to see if the username is already marked as used
   * @param username the username in string form
   */
  public async doesUsernameExist(username: string): Promise<number> {
    if (!_.isString(username)) {
      return Promise.reject(new Error(`userId "${username}" passed is not a valid string`));
    }

    return this.knex('volunteer')
      .select('volunteer_id')
      .where('username', username)
      .first()
      .then((result: IVolunteer) => Promise.resolve(result.volunteer_id))
      .catch((error: Error) => Promise.reject(error));
  }

  // return the current online stauts of the database
  public getOnlineStatus = (): boolean => this.online;

  /**
   * Updates the database password used for communication with the sql server
   * @param password the password that will be used for updating the content
   */
  public setDatabasePassword = (password: string): string => (this.config.connection.password = password);
}
