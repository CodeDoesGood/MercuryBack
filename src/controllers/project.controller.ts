import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import constants from '../constants';
import { IProject, Project } from '../project';
/**
 * Validates that there is a project that exists by the id requested and calls next otherwise
 * sends a bad request back to the server.
 */
function validateProjectId(req: Request, res: Response, next: NextFunction) {
  const projectId: number = req.params.project_id;

  if (_.isNil(projectId) || !_.isString(projectId)) {
    res.status(500).send({ error: 'Status Validation', description: constants.INVALID_PROJECT_ID_FORMAT(projectId) });
  } else {
    req.body.projectId = projectId;
    next();
  }
}

/**
 * Checks and confirms that all values exist that are required for updating the whole project or
 * creating a new project.
 */
function validateProjectUpdateContent(req: Request, res: Response, next: NextFunction) {
  const { project }: { project: IProject } = req.body;

  const projectRequirements: string[] = ['title', 'status', 'project_category', 'image_directory', 'summary', 'description'];

  if (_.isNil(project) || !_.isObject(project)) {
    return res.status(400).send({ error: 'Project Validation', description: constants.INVALID_PROJECT_FORMAT });
  }

  _.forEach(projectRequirements, (requirement: string) => {
    if (!project[requirement] && !res.headersSent) {
      return res.status(400).send({ error: 'Project Validation', description: constants.PROJECT_MUST_CONTAIN(requirement) });
    }
    return 1;
  });

  /**
   * hidden is checked outside of the forEach because when you check !project[requirement]
   * with a boolean it would return true if the value is set to true, making it throw a
   * non existing error, which in fact it does exit but the value is true, and not false.
   */
  if (!_.isBoolean(project.hidden)) {
    return res.status(400).send({ error: 'Project Validation', description: constants.PROJECT_MUST_CONTAIN_HIDDEN });
  }

  if (!res.headersSent) {
    req.body.projectId = project.project_id;
    delete project.project_id;
    req.body.project = project;
    return next();
  }
  return 1;
}

/**
 * Validates that all provided values are the correct type.
 */
function validateProjectUpdateContentTypes(req: Request, res: Response, next: NextFunction) {
  const { project, projectId }: { project: IProject; projectId: number } = req.body;

  if (!_.isInteger(projectId)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_ID_INVALID });
  }  else if (!_.isString(project.title)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_TITLE_INVALID });
  } else if (!_.isInteger(project.status)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_STATUS_INVALID });
  } else if (!_.isInteger(project.project_category)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_PROJECT_CATEGORY_INVALID });
  } else if (!_.isBoolean(project.hidden)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_HIDDEN_INVALID });
  } else if (!_.isString(project.image_directory)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_IMAGE_DIRECTORY_INVALID });
  } else if (!_.isString(project.summary)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_SUMMARY_INVALID });
  } else if (!_.isString(project.description)) {
    res.status(400).send({ error: 'Project Type Validation', description: constants.PROJECT_TYPE_DESCRIPTION_INVALID });
  } else {
    next();
  }
}

/**
 * Updates a project in the project table by the project id,
 *
 * id is required in the req and so is the project object, bith are validated by the
 * validateProjectUpdateContent middleware.
 */
async function updateProjectById(req: Request, res: Response) {
  const content: IProject = req.body.project;
  const { projectId }: { projectId: number } = req.body;

  const project = new Project(projectId);

  try {
    const exists: boolean | Error = await project.exists();
    const updated = await project.updateContent(content);
    res.status(200).send({ message: `Project updated id ${projectId}` });
  } catch (error) {
    res.status(500).send({
      description: constants.UNABLE_TO_UPDATE_PROJECT(projectId),
      error: `${JSON.stringify(error)}`,
    });
  }
}

/**
 * Gets and sends the project requested by id.
 * @return a object containing all the project data.
 */
async function getProjectById(req: Request, res: Response) {
  const projectId: number = parseInt(req.body.projectId, 11);
  const project = new Project(projectId);

  try {
    const exists = await project.exists();
    const content: IProject | Error = project.getContent();
    res.status(200).send({ message: '', content: { project: content } });
  } catch (error) {
    res.status(500).send({
      description: constants.UNABLE_TO_GATHER_PROJECT(projectId),
      error: error.message,
    });
  }
}

export {
  validateProjectId,
  validateProjectUpdateContent,
  validateProjectUpdateContentTypes,
  getProjectById,
  updateProjectById,
};
