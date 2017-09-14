const _ = require('lodash');
const assert = require('assert');

const Project = require('../components/Project/Project');

if (!_.isNil(process.env.TRAVIS)) {
  return;
}

describe('Project Component', () => {
  describe('#exists', () => {
    it('Should reject if the project does not exist', (done) => {
      const project = new Project(1000000);

      project.exists()
        .then(() => done(new Error('Resolved when the project did not exist')))
        .catch((error) => {
          if (error === (`Project ${project.project_id} does not exist`)) { done(); } else { done(error); }
        });
    });

    it('Should resolve after binding all database objects to the project', (done) => {
      const project = new Project(1);

      project.exists()
        .then(() => {
          assert.equal(_.isNil(project.project_id), false, 'id should exist after pulling data from the database');
          assert.equal(_.isNil(project.createdDateTime), false, 'dataEntryDate should exist after pulling data from the database');
          assert.equal(_.isNil(project.title), false, 'title should exist after pulling data from the database');
          assert.equal(_.isNil(project.status), false, 'status should exist after pulling data from the database');
          assert.equal(_.isNil(project.projectCategory), false, 'projectCategory should exist after pulling data from the database');
          assert.equal(_.isNil(project.hidden), false, 'hidden should exist after pulling data from the database');
          done();
        })
        .catch(error => done(new Error(error)));
    });

    it('Should reject if no id is passed', (done) => {
      const project = new Project();

      project.exists()
        .then(() => done(new Error('Resolved when the project did not exist')))
        .catch((error) => {
          if (error === (`id '${project.project_id}' passed is not a valid number`)) { done(); } else { done(error); }
        });
    });
  });

  describe('#updateContent', () => {
    it('Should not update content if id is not passed', (done) => {
      const project = new Project();

      project.updateContent()
        .then(() => done(new Error('Content should not update if project id was not passed, or project does not exist')))
        .catch((error) => {
          if (error === (`Id "${project.project_id}" passed is not a valid number`)) { done(); } else { done(error); }
        });
    });

    it('Should not update content if the project existence is not called', (done) => {
      const project = new Project(1);

      project.updateContent()
        .then(() => done(new Error('Content should not update if project id was not passed, or project does not exist')))
        .catch((error) => {
          if (error === (`Project ${project.project_id} does not exist or has not been checked for existence yet`)) { done(); } else { done(error); }
        });
    });

    it('Should not update content if the project does not exist', (done) => {
      const project = new Project(1000000);

      project.exists()
        .then(() => project.updateContent())
        .then(() => done(new Error('Content should not update if project id was not passed, or project does not exist')))
        .catch((error) => {
          if (error === (`Project ${project.project_id} does not exist`)) { done(); } else { done(error); }
        });
    });
  });

  describe('#getContent', () => {
    it('Should return all contents for the project', () => {
      const project = new Project(1);
      const content = project.getContent();

      assert.equal(_.isUndefined(content.id), false, 'id should be returned within the object when calling getContent');
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
