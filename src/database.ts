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
        .then(() => this.online = true)
        .catch((error: Error) => { throw error; });
    }
  }

  /**
   * Makes a connection to the sql database using knex
   */
  public async connect(): Promise<boolean> {
    return this.knex.raw('select 1+1 as answer')
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  public async doesEmailExist(email: string): Promise<number> {
    if (!_.isString(email)) {
      return Promise.reject(new Error(`email "${email}" passed is not a valid string`));
    }

    return this.knex('volunteer').select('volunteer_id').where('email', email).first()
      .then((result: IVolunteer) => Promise.resolve(result.volunteer_id))
      .catch((error: Error) => Promise.reject(error));
  }

  public async doesUsernameExist(username: string): Promise<number> {
    if (!_.isString(username)) {
      return Promise.reject(new Error(`userId "${username}" passed is not a valid string`));
    }

    return this.knex('volunteer').select('volunteer_id').where('username', username).first()
      .then((result: IVolunteer) => Promise.resolve(result.volunteer_id))
      .catch((error: Error) => Promise.reject(error));
  }

  public getOnlineStatus = (): boolean => this.online;
  public setDatabasePassword = (password: string): string => this.config.connection.password = password;
}
