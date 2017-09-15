const _ = require('lodash');
const assert = require('assert');

const Projects = require('../components/Projects');

if (!_.isNil(process.env.TRAVIS)) {
  return;
}

describe('Projects Component', () => {
  describe('#getAllProjects', () => {
    it('Should resolve a array of projects containing all project details', (done) => {
      const projects = new Projects();

      projects.getAllProjects()
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
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
        })
        .catch(error => done(new Error(error)))
        .finally(() => done());
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllProjects().then((content) => {
        throw new Error(`getAllProjects Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        projects.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#getAllActiveProjects', () => {
    it('Should resolve a array of projects containing all active projects', (done) => {
      const projects = new Projects();

      projects.getAllActiveProjects()
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.status === 1, true, 'Status should be marked as active for all active projects');
          });
        })
        .catch(error => done(new Error(error)))
        .finally(() => done());
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllActiveProjects().then((content) => {
        throw new Error(`getAllActiveProjects Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        projects.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#getAllHiddenProjects', () => {
    it('Should resolve a array of projects containing all hidden projects', (done) => {
      const projects = new Projects();

      projects.getAllHiddenProjects()
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.hidden, true, 'Hidden should be marked as true for all projects');
          });
        })
        .catch(error => done(new Error(error)))
        .finally(() => done());
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllHiddenProjects().then((content) => {
        throw new Error(`getAllHiddenProjects Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        projects.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#getAllProjectsByStatus', () => {
    it('Should resolve a array of projects containing the projects with the correct status id', (done) => {
      const projects = new Projects();

      projects.getAllProjectsByStatus(1)
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.status === 1, true, 'status should be marked as the passed status id "1" for all projects gathered');
          });
        })
        .catch(error => done(new Error(error)))
        .finally(() => done());
    });

    it('Should reject if no id is passed', (done) => {
      const projects = new Projects();

      projects.getAllProjectsByStatus()
        .then(() => done(new Error('Resolved when no status id was passed')))
        .catch(() => done());
    });
  });

  describe('#getAllProjectsByCategory', () => {
    it('Should resolve a array of projects containing the projects with the correct category id', (done) => {
      const projects = new Projects();

      projects.getAllProjectsByCategory(1)
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.project_category === 1, true, 'category should be marked as the passed category id "1" for all projects gathered');
          });
        })
        .catch(error => done(new Error(error)))
        .finally(() => done());
    });

    it('Should reject if no id is passed', (done) => {
      const projects = new Projects();

      projects.getAllProjectsByCategory()
        .then(() => done(new Error('Resolved when no category id was passed')))
        .catch(() => done());
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllProjectsByCategory(1).then((content) => {
        throw new Error(`getAllProjectsByCategory Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        projects.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });
});
