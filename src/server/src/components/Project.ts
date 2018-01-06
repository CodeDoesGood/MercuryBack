import * as Promise from 'bluebird';
import * as _ from 'lodash';

import Configuration from './Configuration/Configuration';
import Database from './Database';

const config = new Configuration('mercury', 'mercury.json');

export interface IProject {
  [index: string]: any;

  created_datetime: string;
  description: string;
  hidden: boolean;
  image_directory: string;
  project_category: number;
  project_id: number;
  status: number;
  summary: string;
  title: string;
}

export default class Project extends Database {
  [index: string]: any;

  public hidden: boolean;
  public doesExist: boolean;
  public projectId: number;
  public createdDateTime: string;
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
   * Checks to see if the project exists by the projectId, updating the content and resolving true
   * if it exists, otherwise rejects with the error message
   */
  public exists(): Promise<boolean | Error> {
    if (_.isNil(this.projectId) || !_.isNumber(this.projectId)) {
      return Promise.reject(new Error(`id '${this.projectId}' passed is not a valid number`));
    }

    return this.knex('project').where('project_id', this.projectId).first()
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
      });
  }

  /**
   * Updates a project by id with the provided content
   */
  public updateContent(projectContent: IProject): Promise<boolean | Error> {
    if (_.isNil(this.projectId) || !_.isNumber(this.projectId)) {
      return Promise.reject(new Error(`Id "${this.projectId}" passed is not a valid number`));
    }

    if (!this.doesExist) {
      return Promise.reject(new Error(`Project ${this.projectId} does not exist or has not been checked for existence yet`));
    }

    this.description     = projectContent.description;
    this.hidden          = projectContent.hidden;
    this.imageDirectory  = projectContent.image_directory;
    this.projectCategory = projectContent.project_category;
    this.status          = projectContent.status;
    this.summary         = projectContent.summary;
    this.title           = projectContent.title;

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
