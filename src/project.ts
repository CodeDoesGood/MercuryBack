import * as _ from 'lodash';

import { Configuration } from './configuration';
import { Database } from './database';

const config = new Configuration();

export interface IProject {
  created_datetime: Date;
  description?: string;
  hidden: boolean;
  image_directory?: string;
  project_category: number;
  project_id?: number;
  status: number;
  summary?: string;
  title: string;

  [index: string]: any;
}

export class Project extends Database {
  [index: string]: any;

  public hidden: boolean;
  public doesExist: boolean;
  public projectId: number;
  public createdDateTime: Date;
  public title: string;
  public status: number;
  public projectCategory: number;
  public imageDirectory: string;
  public summary: string;
  public description: string;

  constructor(projectId?: number) {
    super(config.getKey('database'));

    this.projectId = projectId;
    this.createdDateTime = null;
    this.title = null;
    this.status = null;
    this.projectCategory = null;
    this.hidden = null;
    this.imageDirectory = null;
    this.summary = null;
    this.description = null;
  }

  /**
   * Creates the new project in the database
   */
  public async createNewProject(): Promise<number> {
    return this.validateProjectContent()
      .then((project: IProject) => this.knex('project').insert(Object.assign(project, {
        data_entry_user_id: 1,
      })))
      .then((id: number) => Promise.resolve(id))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Checks to see if the project exists by the projectId, updating the content and resolving true
   * if it exists, otherwise rejects with the error message
   */
  public async exists(): Promise<boolean | Error> {
    if (_.isNil(this.projectId) || !_.isNumber(this.projectId)) {
      return Promise.reject(new Error(`id '${this.projectId}' passed is not a valid number`));
    }

    return this.knex('project').where('project.project_id', this.projectId).andWhere('hidden', false)
      .select(
        'project_id', 'created_datetime', 'title', 'project_status.status',
        'project_category.category as project_category', 'image_directory', 'project.description', 'summary', 'data_entry_user_id')
      .join('project_status', 'project.status', 'project_status.project_status_id')
      .join('project_category', 'project.project_category', 'project_category.project_category_id')
      .first()
      .then((project) => {
        if (_.isNil(project)) {
          return Promise.reject(new Error(`Project ${this.projectId} does not exist`));
        }
        this.createdDateTime = project.created_datetime;
        this.title = project.title;
        this.status = project.status;
        this.projectCategory = project.project_category;
        this.hidden = project.hidden;
        this.imageDirectory = project.image_directory;
        this.summary = project.summary;
        this.description = project.description;
        this.doesExist = true;
        return Promise.resolve(true);
      })
      .catch((error: Error) => Promise.reject((error)));
  }

  /**
   * Validates the required details for project creation is there to create the project
   */
  public async validateProjectContent(): Promise<IProject> {
    if (_.isNil(this.title)) {
      return Promise.reject((new Error(`title is required to create a project title=${this.title}`)));
    }

    if (_.isNil(this.status)) {
      return Promise.reject((new Error(`status is required to create a project title=${this.status}`)));
    }

    if (_.isNil(this.projectCategory)) {
      return Promise.reject((new Error(`projectCategory is required to create a project title=${this.projectCategory}`)));
    }

    if (_.isNil(this.hidden)) {
      return Promise.reject(((new Error(`hidden is required to create a project title=${this.hidden}`))));
    }

    const date = new Date();

    const project: IProject = {
      created_datetime: date,
      description: this.description,
      hidden: this.hidden,
      image_directory: this.imageDirectory,
      project_category: this.projectCategory,
      status: this.status,
      summary: this.summary,
      title: this.title,
    };

    return Promise.resolve(project);
  }

  /**
   * Updates a project by id with the provided content
   */
  public async updateContent(projectContent: IProject): Promise<boolean> {
    if (_.isNil(this.projectId) || !_.isNumber(this.projectId)) {
      return Promise.reject(new Error(`Id "${this.projectId}" passed is not a valid number`));
    }

    if (!this.doesExist) {
      return Promise.reject(new Error(`Project ${this.projectId} does not exist or has not been checked for existence yet`));
    }

    this.description = projectContent.description;
    this.hidden = projectContent.hidden;
    this.imageDirectory = projectContent.image_directory;
    this.projectCategory = projectContent.project_category;
    this.status = projectContent.status;
    this.summary = projectContent.summary;
    this.title = projectContent.title;

    return this.knex('project').where('project_id', this.projectId).update({
      description: this.description,
      hidden: this.hidden,
      image_directory: this.imageDirectory,
      project_category: this.projectCategory,
      status: this.status,
      summary: this.summary,
      title: this.title,
    })
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * sets the project content for the class
   * @param projectContent IProject content of project information
   */
  public async setContent(projectContent: IProject): Promise<boolean> {
    this.description = _.defaultTo(projectContent.description, '');
    this.hidden = _.defaultTo(projectContent.hidden, false);
    this.imageDirectory = _.defaultTo(projectContent.image_directory, '');
    this.projectCategory = _.defaultTo(projectContent.project_category, null);
    this.status = _.defaultTo(projectContent.status, null);
    this.summary = _.defaultTo(projectContent.summary, null);
    this.title = _.defaultTo(projectContent.title, '');
    return Promise.resolve(true);
  }

  /**
   * Returns all the content of the project.
   */
  public getContent(): IProject {
    return {
      created_datetime: this.createdDateTime,
      description: this.description,
      hidden: this.hidden,
      image_directory: this.imageDirectory,
      project_category: this.projectCategory,
      project_id: this.projectId,
      status: this.status,
      summary: this.summary,
      title: this.title,
    };
  }
}
