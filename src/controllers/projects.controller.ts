import * as _ from 'lodash';

import { NextFunction, Request, Response } from 'express';

import constants from '../constants/constants';
import { Projects } from '../projects';

import ApiError from '../ApiError';
import { IProject } from '../project';

const projectsWrapper = new Projects();

/**
 * Gets and sends every single project that is active, inactive, hidden
 * @returns A array of objects containing all project details for
 * every single project.
 */
async function getAllProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects: IProject[] | Error = await projectsWrapper.getAllProjects();
    res.status(200).send({ message: 'All projects', content: { projects } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Projects Gathering', constants.UNABLE_TO_GATHER_PROJECTS));
  }
}

/**
 * Gets and sends every single active project.
 * @returns A array of objects containing all
 * details on active projects.
 */
async function getAllActiveProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects: IProject[] | Error = await projectsWrapper.getAllActiveProjects();
    res.status(200).send({ message: 'All active projects', content: { projects } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Projects Gathering', constants.UNABLE_TO_GATHER_ACTIVE_PROJECTS));
  }
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
async function getAllProjectsByStatus(req: Request, res: Response, next: NextFunction) {
  const { status }: { status: number } = req.body;

  try {
    const projects: IProject[] | Error = await projectsWrapper.getAllProjectsByStatus(status);
    res.status(200).send({ message: 'All projects by status', content: { projects } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Projects Gathering', constants.UNABLE_TO_GATHER_BY_STATUS(status)));
  }
}

/**
 * Gets and sends all projects by category
 * @returns A array of objects containing all project details of projects that match the requested
 * category.
 */
async function getAllProjectsByCategory(req: Request, res: Response, next: NextFunction) {
  const { category }: { category: number } = req.body;

  try {
    const projects: IProject[] | Error = await projectsWrapper.getAllProjectsByCategory(category);
    res.status(200).send({ message: 'All projects by category', content: { projects } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Projects Gathering', constants.UNABLE_TO_GATHER_BY_CATEGORY(category)));
  }
}

/**
 * Gets and sends all hidden projects.
 * @returns A array of objects containing all project details of projects that are hidden
 */
async function getAllHiddenProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects: IProject[] | Error = await projectsWrapper.getAllHiddenProjects();
    res.status(200).send({ message: 'All hidden projects', content: { projects } });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Projects Gathering', constants.UNABLE_TO_GATHER_ALL_HIDDEN));
  }
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
