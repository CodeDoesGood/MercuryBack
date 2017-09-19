const _ = require('lodash');
const assert = require('assert');

const Project = require('../components/Project');

if (!_.isNil(process.env.TRAVIS)) {
  return;
}

describe('Project Component', () => {
  describe('#exists', () => {
    it('Should reject if the project does not exist', () => {
      const project = new Project(1000000);

      return project.exists()
        .then(() => {
          throw new Error('Resolved when the project did not exist');
        }, (error) => {
          assert.equal(error, `Project ${project.project_id} does not exist`, error);
        });
    });

    it('Should resolve after binding all database objects to the project', () => {
      const project = new Project(1);

      return project.exists()
        .then(() => {
          assert.equal(_.isNil(project.project_id), false, 'id should exist after pulling data from the database');
          assert.equal(_.isNil(project.createdDateTime), false, 'dataEntryDate should exist after pulling data from the database');
          assert.equal(_.isNil(project.title), false, 'title should exist after pulling data from the database');
          assert.equal(_.isNil(project.status), false, 'status should exist after pulling data from the database');
          assert.equal(_.isNil(project.projectCategory), false, 'projectCategory should exist after pulling data from the database');
          assert.equal(_.isNil(project.hidden), false, 'hidden should exist after pulling data from the database');
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if no id is passed', () => {
      const project = new Project();

      return project.exists()
        .then(() => {
          throw new Error('Resolved when the project did not exist');
        }, (error) => {
          assert.equal(error, `id '${project.project_id}' passed is not a valid number`, error);
        });
    });
  });

  describe('#updateContent', () => {
    it('Should not update content if id is not passed', () => {
      const project = new Project();

      return project.updateContent()
        .then(() => {
          throw new Error('Content should not update if project id was not passed, or project does not exist');
        }, (error) => {
          assert.equal(error, `Id "${project.project_id}" passed is not a valid number`, error);
        });
    });

    it('Should not update content if the project existence is not called', () => {
      const project = new Project(1);

      return project.updateContent()
        .then(() => {
          throw new Error('Content should not update if project id was not passed, or project does not exist');
        }, (error) => {
          assert.equal(error, `Project ${project.project_id} does not exist or has not been checked for existence yet`, error);
        });
    });

    it('Should not update content if the project does not exist', () => {
      const project = new Project(1000000);

      return project.exists()
        .then(() => project.updateContent())
        .then(() => {
          throw new Error('Content should not update if project id was not passed, or project does not exist');
        }, (error) => {
          assert.equal(error, `Project ${project.project_id} does not exist`, error);
        });
    });

    it('Shouldn\'t attempt to update content if the project "doesExist" is marked as false', () => {
      const project = new Project(1000);
      project.doesExist = false;

      return project.updateContent()
        .then(() => {
          throw new Error(`Updated content when doesExist is false, doesExist=${project.doesExist}`);
        }, (error) => {
          assert.equal(error === `Project ${project.project_id} does not exist or has not been checked for existence yet`, true, error);
        });
    });

    it('Shouldn\'t attempt to update content if the project id is not a valid number', () => {
      const project = new Project('1000');
      project.doesExist = false;

      return project.updateContent()
        .then(() => {
          throw new Error(`Updated content when project id is not a valid number, project_id=${project.project_id}`);
        }, (error) => {
          assert.equal(error === `Id "${project.project_id}" passed is not a valid number`, true, error);
        });
    });
  });

  describe('#getContent', () => {
    it('Should return all contents for the project', () => {
      const project = new Project(1);
      const content = project.getContent();

      assert.equal(_.isUndefined(content.project_id), false, 'id should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.createdDateTime), false, 'dataEntryDate should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.title), false, 'title should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.status), false, 'status should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.projectCategory), false, 'projectCategory should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.hidden), false, 'hidden should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.imageDirectory), false, 'imageDirectory should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.summary), false, 'summary should be returned within the object when calling getContent');
      assert.equal(_.isUndefined(content.description), false, 'description should be returned within the object when calling getContent');
    });
  });
});
