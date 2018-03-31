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
      .raw('SELECT 1+1 AS answer')
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Checks to see if a item exists in the database
   * @param table the table name
   * @param index index to select
   * @param column column to check for existing
   * @param value the value to search
   */
  public async itemExists(table, index, column, value): Promise<number> {
    return this.knex(table)
      .select(`${index} AS exists`)
      .where(column, value)
      .first()
      .then((result: { exists }) => Promise.resolve(result.exists))
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

    return this.itemExists('volunteer', 'volunteer_id', 'email', email);
  }

  /**
   * Checks to see if the username is already marked as used
   * @param username the username in string form
   */
  public async doesUsernameExist(username: string): Promise<number> {
    if (!_.isString(username)) {
      return Promise.reject(new Error(`userId "${username}" passed is not a valid string`));
    }

    return await this.itemExists('volunteer', 'volunteer_id', 'username', username);
  }

  // return the current online stauts of the database
  public getOnlineStatus = (): boolean => this.online;

  /**
   * Updates the database password used for communication with the sql server
   * @param password the password that will be used for updating the content
   */
  public setDatabasePassword = (password: string): string => (this.config.connection.password = password);
}
