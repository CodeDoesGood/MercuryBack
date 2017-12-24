import * as Promise from 'bluebird';
import * as _ from 'lodash';

import { IProject } from './Project';

import Configuration from './Configuration/Configuration';
import Database from './Database';

const config = new Configuration('mercury', 'mercury.json');

export default class Projects extends Database {
  constructor() {
    super(config.getKey('database'));
  }

  /**
   * Returns all projects
   */
  public getAllProjects(): Promise<IProject[] | Error> {
    return this.connect()
      .then(() => this.knex.select().from('project'))
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns all active projects
   */
  public getAllActiveProjects(): Promise<IProject[] | Error> {
    return this.connect()
      .then(() => this.knex('project').where('status', 1).andWhere('hidden', false))
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns all projects marked by the status
   * @param status
   */
  public getAllProjectsByStatus(status: number): Promise<IProject[] | Error> {
    if (!_.isString(status) && !_.isNumber(status)) {
      return Promise.reject(new Error(`volunteerId "${status}" passed is not a valid string or number`));
    }

    return this.connect()
      .then(() => this.knex('project').where('status', status))
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns all projects marked by the category
   * @param category
   */
  public getAllProjectsByCategory(category: number): Promise<IProject[] | Error> {
    if (!_.isString(category) && !_.isNumber(category)) {
      return Promise.reject(new Error(`volunteerId "${category}" passed is not a valid string or number`));
    }

    return this.connect()
      .then(() => this.knex('project').where('project_category', category))
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns all projects marked as hidden
   */
  public getAllHiddenProjects(): Promise<IProject[] | Error> {
    return this.connect()
      .then(() => this.knex('project').where('hidden', true))
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }
}
