import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import constants from '../components/constants';
import Projects from '../components/Projects';

import { IProject } from '../components/Project';

const projectsWrapper = new Projects();

/**
 * Gets and sends every single project that is active, inactive, hidden
 * @returns A array of objects containing all project details for
 * every single project.
 */
function getAllProjects(req: Request, res: Response) {
  projectsWrapper.getAllProjects()
    .then((projects: IProject[]) => res.status(200).send({ message: 'All Projects', content: { projects } }))
    .catch(() => res.send(500).send({ error: 'Project Gathering', description: constants.UNABLE_TO_GATHER_PROJECTS }));
}

/**
 * Gets and sends every single active project.
 * @returns A array of objects containing all
 * details on active projects.
 */
function getAllActiveProjects(req: Request, res: Response) {
  projectsWrapper.getAllActiveProjects()
    .then((projects: IProject[]) => res.status(200).send({ message: 'All Active Projects', content: { projects } }))
    .catch((error: Error) => res.status(500).send({
      description: constants.UNABLE_TO_GATHER_ACTIVE_PROJECTS,
      error: `${JSON.stringify(error)}`,
    }));
}

/**
 * When requesting for projects by status, this should validate that the status
 * being requested is a valid status that is being used within the database.
 * If there is no status of that type in the database then a invalid request should be
 * sent back to the server.
 *
 * If the status is valid then next would be called to move onto the next middleware.
 */
function validateProjectStatus(req: Request, res: Response, next: NextFunction) {
  const { status }: { status: number } = req.params;

  if (_.isNil(status) || !_.isString(status)) {
    res.status(500).send({ error: 'Status Validation', description: constants.INVALID_STATUS_FORMAT });
  } else {
    req.body.status = status;
    next();
  }
}

/**
 * Validates that the category is a valid format
 */
function validateProjectCategory(req: Request, res: Response, next: NextFunction) {
  const { category }: { category: number } = req.params;

  if (_.isNil(category) || !_.isString(category)) {
    res.status(500).send({ error: 'Category validation', description: constants.INVALID_CATEGORY_FORMAT });
  } else {
    req.body.category = category;
    next();
  }
}

/**
 * Gets and sends all projects by status
 * @returns A array of objects containing all project details of projects that match the requested
 * status.
 */
function getAllProjectsByStatus(req: Request, res: Response) {
  const { status }: { status: number } = req.body;

  projectsWrapper.getAllProjectsByStatus(status)
    .then((projects: IProject[]) => res.status(200).send({ message: 'All projects by status', content: { projects } }))
    .catch((error: Error) => res.status(500).send({
      description: constants.UNABLE_TO_GATHER_BY_STATUS(status),
      error: `${JSON.stringify(error)}`,
    }));
}

/**
 * Gets and sends all projects by category
 * @returns A array of objects containing all project details of projects that match the requested
 * category.
 */
function getAllProjectsByCategory(req: Request, res: Response) {
  const { category }: { category: number } = req.body;

  projectsWrapper.getAllProjectsByCategory(category)
    .then((projects: IProject[]) => res.status(200).send({ message: 'All projects by category', content: { projects } }))
    .catch((error: Error) => res.status(500).send({
      description: constants.UNABLE_TO_GATHER_BY_CATEGORY(category),
      error: `${JSON.stringify(error)}`,
    }));
}

/**
 * Gets and sends all hidden projects.
 * @returns A array of objects containing all project details of projects that are hidden
 */
function getAllHiddenProjects(req: Request, res: Response) {
  projectsWrapper.getAllHiddenProjects()
    .then((projects: IProject[]) => res.status(200).send({ message: 'All hidden projects', content: { projects } }))
    .catch((error: Error) => res.status(500).send({
      description: constants.UNABLE_TO_GATHER_ALL_HIDDEN,
      error: `${JSON.stringify(error)}`,
    }));
}

export {
  getAllActiveProjects,
  getAllHiddenProjects,
  getAllProjects,
  getAllProjectsByCategory,
  getAllProjectsByStatus,
  validateProjectCategory,
  validateProjectStatus,
};
