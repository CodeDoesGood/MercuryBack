const _ = require('lodash');
const assert = require('assert');

const Projects = require('../components/Projects');

if (!_.isNil(process.env.TRAVIS)) {
  return;
}

describe('Projects Component', () => {
  describe('#getAllProjects', () => {
    it('Should resolve a array of projects containing all project details', () => {
      const projects = new Projects();

      return projects.getAllProjects()
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
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllProjects()
        .then((content) => {
          throw new Error(`getAllProjects Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          projects.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#getAllActiveProjects', () => {
    it('Should resolve a array of projects containing all active projects', () => {
      const projects = new Projects();

      return projects.getAllActiveProjects()
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.status === 1, true, 'Status should be marked as active for all active projects');
          });
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllActiveProjects()
        .then((content) => {
          throw new Error(`getAllActiveProjects Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          projects.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#getAllHiddenProjects', () => {
    it('Should resolve a array of projects containing all hidden projects', () => {
      const projects = new Projects();

      return projects.getAllHiddenProjects()
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.hidden, true, 'Hidden should be marked as true for all projects');
          });
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllHiddenProjects()
        .then((content) => {
          throw new Error(`getAllHiddenProjects Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          projects.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#getAllProjectsByStatus', () => {
    it('Should resolve a array of projects containing the projects with the correct status id', () => {
      const projects = new Projects();

      return projects.getAllProjectsByStatus(1)
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.status === 1, true, 'status should be marked as the passed status id "1" for all projects gathered');
          });
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if no id is passed', () => {
      const projects = new Projects();

      projects.getAllProjectsByStatus()
        .then(() => { throw new Error('Resolved when no status id was passed'); }, () => {});
    });
  });

  describe('#getAllProjectsByCategory', () => {
    it('Should resolve a array of projects containing the projects with the correct category id', () => {
      const projects = new Projects();

      return projects.getAllProjectsByCategory(1)
        .then((gotProjects) => {
          _.forEach(gotProjects, (project) => {
            assert.equal(project.project_category === 1, true, 'category should be marked as the passed category id "1" for all projects gathered');
          });
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if no id is passed', () => {
      const projects = new Projects();

      return projects.getAllProjectsByCategory()
        .then(() => { throw new Error('Resolved when no category id was passed'); }, () => {});
    });

    it('Should reject if the connection details are wrong', () => {
      const projects = new Projects();
      const username = projects.info.connection.user;
      projects.info.connection.user = 'wrongusername';

      return projects.getAllProjectsByCategory(1)
        .then((content) => {
        throw new Error(`getAllProjectsByCategory Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          projects.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });
});
