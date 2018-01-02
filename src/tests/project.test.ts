import * as assert from 'assert';
import * as _ from 'lodash';

import Project, { IProject } from '../components/Project';

if (_.isNil(process.env.TRAVIS)) {
  describe('Project Component', () => {
    describe('#exists', () => {
      it('Should reject if the project does not exist', () => {
        const project = new Project(1000000);

        return project.exists()
          .then(() => {
            throw new Error('Resolved when the project did not exist');
          },    (error: Error) => {
            assert.equal(error.message, `Project ${project.projectId} does not exist`, error.message);
          });
      });

      it('Should resolve after binding all database objects to the project', () => {
        const project = new Project(1);

        return project.exists()
          .then(() => {
            assert.equal(_.isNil(project.projectId), false, 'id should exist after pulling data from the database');
            assert.equal(_.isNil(project.createdDateTime), false, 'createdDateTime should exist after pulling data from the database');
            assert.equal(_.isNil(project.title), false, 'title should exist after pulling data from the database');
            assert.equal(_.isNil(project.status), false, 'status should exist after pulling data from the database');
            assert.equal(_.isNil(project.projectCategory), false, 'projectCategory should exist after pulling data from the database');
            assert.equal(_.isNil(project.hidden), false, 'hidden should exist after pulling data from the database');
          },    (error: Error) => { throw new Error(error.message); });
      });

      it('Should reject if no id is passed', () => {
        const project = new Project();

        return project.exists()
          .then(() => {
            throw new Error('Resolved when the project did not exist');
          },    (error: Error) => {
            assert.equal(error.message, `id '${project.projectId}' passed is not a valid number`, error.message);
          });
      });
    });

    describe('#updateContent', () => {
      it('Should not update content if id is not passed', () => {
        const project = new Project();
        const content: any = {};

        return project.updateContent(content)
          .then(() => {
            throw new Error('Content should not update if project id was not passed, or project does not exist');
          },    (error: Error) => {
            assert.equal(error.message, `Id "${project.projectId}" passed is not a valid number`, error.message);
          });
      });

      it('Should not update content if the project existence is not called', () => {
        const project = new Project(1);
        const content: any = {};

        return project.updateContent(content)
          .then(() => {
            throw new Error('Content should not update if project id was not passed, or project does not exist');
          },    (error: Error) => {
            assert.equal(
              error.message,
              `Project ${project.projectId} does not exist or has not been checked for existence yet`,
              error.message);
          });
      });

      it('Should not update content if the project does not exist', () => {
        const project = new Project(1000000);
        const content: any = {};

        return project.exists()
          .then(() => project.updateContent(content))
          .then(() => {
            throw new Error('Content should not update if project id was not passed, or project does not exist');
          },    (error: Error) => {
            assert.equal(error.message, `Project ${project.projectId} does not exist`, error.message);
          });
      });

      it('Shouldn\'t attempt to update content if the project "doesExist" is marked as false', () => {
        const project = new Project(1000);
        const content: any = {};

        project.doesExist = false;

        return project.updateContent(content)
          .then(() => {
            throw new Error(`Updated content when doesExist is false, doesExist=${project.doesExist}`);
          },    (error: Error) => {
            assert.equal(
              error.message === `Project ${project.projectId} does not exist or has not been checked for existence yet`,
              true, error.message);
          });
      });

      it('Shouldn\'t attempt to update content if the project id is not a valid number', () => {
        const idString: any = '1000';
        const project = new Project(idString);
        const content: any = {};
        project.doesExist = false;

        return project.updateContent(content)
          .then(() => {
            throw new Error(`Updated content when project id is not a valid number, project_id=${project.projectId}`);
          },    (error: Error) => {
            assert.equal(error.message === `Id "${project.projectId}" passed is not a valid number`, true, error.message);
          });
      });

      it('Shoould update the content if the project exists and the content is valid', () => {
        const project = new Project(1);

        return project.exists()
        .then(() => project.updateContent(project.getContent()))
        .then((done: boolean) => {
          assert.equal(done, true, 'Should return boolean of true when the content is updated');
        },    (error: Error) => { throw new Error(error.message); });
      });

      it('Should reject if the connection details are wrong', () => {
        const project = new Project(1);
        project.doesExist = true;

        const username: string = project.config.connection.user;
        project.config.connection.user = 'wrongusername';
        project.volunteerId = 1;

        return project.updateContent(project.getContent())
          .then((content) => {
            throw new Error(`updateContent Shouldn't of resolved when the connection details are wrong, ${content}`);
          },    (error: Error) => {
            project.config.connection.user = username;
            assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error.message);
          });
      });
    });

    describe('#getContent', () => {
      it('Should return all contents for the project', () => {
        const project = new Project(1);
        const content = project.getContent();

        assert.equal(
          _.isUndefined(content.project_id),
          false,
          'id should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.created_datetime),
          false,
          'dataEntryDate should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.title),
          false,
          'title should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.status),
          false,
          'status should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.project_category),
          false,
          'projectCategory should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.hidden),
          false,
          'hidden should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.image_directory),
          false,
          'imageDirectory should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.summary),
          false,
          'summary should be returned within the object when calling getContent',
        );

        assert.equal(
          _.isUndefined(content.description),
          false,
          'description should be returned within the object when calling getContent',
        );
      });
    });
  });
}
