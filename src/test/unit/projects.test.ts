import * as assert from 'assert';
import * as _ from 'lodash';

import { IProject, Project } from '../..//project';
import { Projects } from '../..//projects';

if (_.isNil(process.env.TRAVIS)) {
  describe('Projects Component', () => {
    describe('#getAllProjects', () => {
      it('Should resolve a array of projects containing all project details', () => {
        const projects = new Projects();

        return projects.getAllProjects().then(
          (gotProjects: any) => {
            _.forEach(gotProjects, (project: any) => {
              assert.equal(!_.isUndefined(project.project_id), true, 'project_id should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.created_datetime), true, 'created_datetime should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.title), true, 'title should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.status), true, 'status should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.project_category), true, 'projectCategory should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.hidden), true, 'hidden should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.image_directory), true, 'imageDirectory should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.summary), true, 'summary should not be undefined within a project.');
              assert.equal(!_.isUndefined(project.description), true, 'description should not be undefined within a project.');
            });
          },
          (error: Error) => {
            throw error;
          },
        );
      });
    });

    describe('#getAllActiveProjects', () => {
      it('Should resolve a array of projects containing all active projects', () => {
        const projects = new Projects();

        return projects.getAllActiveProjects().then(
          (gotProjects: any) => {
            _.forEach(gotProjects, (project: any) => {
<<<<<<< HEAD
              assert.equal(project.status === 'Online', true, 'Status should be marked as active for all active projects');
=======
              assert.equal(project.status.toLowerCase() === 'online', true, 'Status should be marked as active for all active projects');
>>>>>>> feature/apiDocumentationGeneration
            });
          },
          (error: Error) => {
            throw error;
          },
        );
      });
    });

    describe('#getAllHiddenProjects', () => {
      it('Should resolve a array of projects containing all hidden projects', () => {
        const projects = new Projects();

        return projects.getAllHiddenProjects().then(
          (gotProjects: any) => {
            _.forEach(gotProjects, (project: any) => {
              assert.equal(project.hidden, true, 'Hidden should be marked as true for all projects');
            });
          },
          (error: string) => {
            throw new Error(error);
          },
        );
      });
    });

    describe('#getAllProjectsByStatus', () => {
      it('Should resolve a array of projects containing the projects with the correct status id', () => {
        const projects = new Projects();

        return projects.getAllProjectsByStatus(1).then(
          (gotProjects: any) => {
            _.forEach(gotProjects, (project: any) => {
              assert.equal(
                project.status.toLowerCase() === 'online', true,
                'status should be marked as online id "1/Online" for all projects gathered');
            });
          },
          (error: string) => {
            throw new Error(error);
          },
        );
      });

      it('Should reject if no id is passed', () => {
        const id: any = undefined;

        const projects = new Projects();

        projects.getAllProjectsByStatus(id).then(
          () => {
            throw new Error('Resolved when no status id was passed');
          },
          () => assert(true),
        );
      });
    });

    describe('#getAllProjectsByCategory', () => {
      it('Should resolve a array of projects containing the projects with the correct category id', () => {
        const projects = new Projects();

        return projects.getAllProjectsByCategory(1).then(
          (gotProjects: Error) => {
            _.forEach(gotProjects, (project: any) => {
              assert.equal(
                project.project_category === 1,
                true,
                'category should be marked as the passed category id "1" for all projects gathered',
              );
            });
          },
          (error: Error) => {
            throw error;
          },
        );
      });

      it('Should reject if no id is passed', () => {
        const projects = new Projects();

        return projects.getAllProjectsByCategory(undefined).then(
          () => {
            throw new Error('Resolved when no category id was passed');
          },
          () => assert(true),
        );
      });
    });
  });
}
