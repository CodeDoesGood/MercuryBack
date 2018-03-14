import * as _ from 'lodash';

import { Configuration } from './configuration';
import { Database } from './database';
import { IProject } from './project';

import * as databaseConstants from './constants/databaseConstants';

const config = new Configuration();

export class Projects extends Database {
  constructor() {
    super(config.getKey('database'));
  }

  /**
   * Returns all projects
   */
  public async getAllProjects(): Promise<IProject[] | Error> {
    return this.knex.select().from('project')
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns all active projects
   * @returns {Promise<IProject[] | Error>}
   */
  public async getAllActiveProjects(): Promise<IProject[] | Error> {
    return await this.getAllProjectsByStatus(databaseConstants.projectStatus.ONLINE, databaseConstants.projectHidden.SHOWN);
  }

  /**
   * Returns all projects marked by the status
   * @param status
   * @param hidden
   */
  public async getAllProjectsByStatus(status: number, hidden: boolean = false): Promise<IProject[] | Error> {
    if (!_.isString(status) && !_.isNumber(status)) {
      return Promise.reject(new Error(`userId "${status}" passed is not a valid string or number`));
    }

    return this.knex('project').where('project.status', status).andWhere('hidden', hidden)
      .select(
        'project_id', 'created_datetime', 'title', 'project_status.status',
        'project_category.category as project_category', 'image_directory', 'project.description', 'summary', 'data_entry_user_id')
      .join('project_status', 'project.status', 'project_status.project_status_id')
      .join('project_category', 'project.project_category', 'project_category.project_category_id')
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns all projects marked by the category
   * @param category
   */
  public async getAllProjectsByCategory(category: number): Promise<IProject[] | Error> {
    if (!_.isString(category) && !_.isNumber(category)) {
      return Promise.reject(new Error(`userId "${category}" passed is not a valid string or number`));
    }

    return this.knex('project').where('project_category', category)
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Returns all projects marked as hidden
   */
  public async getAllHiddenProjects(): Promise<IProject[] | Error> {
    return this.knex('project').where('hidden', true)
      .then(projects => Promise.resolve(projects))
      .catch((error: Error) => Promise.reject(error));
  }
}
