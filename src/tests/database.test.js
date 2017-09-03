const _ = require('lodash');
const assert = require('assert');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const DatabaseWrapper = require('../components/DatabaseWrapper/DatabaseWrapper');

const config = new ConfigurationWrapper('mercury', 'mercury.json');
const databaseWrapper = new DatabaseWrapper(config.getKey('databasePath'));

databaseWrapper.showMessage = false;

describe('Database Wrapper', () => {
  describe('#getOnlineStatus', () => {
    it('Should return true if online', () => {
      const onlineStatus = databaseWrapper.getOnlineStatus();
      assert.equal(onlineStatus, true);
    });

    it('Should return false if online is false', () => {
      databaseWrapper.online = false;

      const onlineStatus = databaseWrapper.getOnlineStatus();
      assert.equal(onlineStatus, false);
    });
  });

  describe('#getProjectById', () => {
    it('Should return project details if the id is valid', (done) => {
      databaseWrapper.getProjectById(1).then((result) => {
        done(assert.equal(result.id, 1));
      }).catch(error => done(error));
    });
    it('Should return a empty object if the id is not a valid id', (done) => {
      databaseWrapper.getProjectById(0).then((result) => {
        done(assert.equal(Object.keys(result).length, 0));
      }).catch(error => done(error));
    });
    it('Should return a empty object if the id is not a valid number', (done) => {
      databaseWrapper.getProjectById('invalid').then((result) => {
        done(assert.equal(Object.keys(result).length, 0));
      }).catch(error => done(error));
    });
    it('Should return a empty object if the id is null or undefined', (done) => {
      databaseWrapper.getProjectById(null).then((result) => {
        done(assert.equal(Object.keys(result).length, 0));
      }).catch(error => done(error));
    });
  });

  describe('#GetAllProjects', () => {
    it('Should return projects with information', (done) => {
      databaseWrapper.getAllProjects()
        .then((result) => {
          assert.equal(result.length > 0, true);

          _.forEach(result, (project) => {
            assert.equal(_.isNil(project.id), false);
          });

          done();
        }).catch(error => done(error));
    });
  });

  describe('#getAllActiveProjects', () => {
    it('Should return projects with active status', (done) => {
      databaseWrapper.getAllActiveProjects()
        .then((result) => {
          _.forEach(result, (project) => {
            assert.equal(project.status, 'active');
          });

          done();
        }).catch(error => done(error));
    });
  });

  describe('#getAllHiddenProjects', () => {
    it('Should return projects with active status', (done) => {
      databaseWrapper.getAllHiddenProjects()
        .then((result) => {
          _.forEach(result, (project) => {
            assert.equal(project.hidden, true);
          });

          done();
        }).catch(error => done(error));
    });
  });


  describe('#getAllProjectsByStatus', () => {
    it('Should return projects with active status passed', (done) => {
      databaseWrapper.getAllProjectsByStatus('active')
        .then((result) => {
          _.forEach(result, (project) => {
            assert.equal(project.status, 'active');
          });

          done();
        }).catch(error => done(error));
    });
  });

  describe('#getAllProjectsByCategory', () => {
    it.only('Should return projects with correct category passed', (done) => {
      databaseWrapper.getAllProjectsByCategory('1')
        .then((result) => {
          _.forEach(result, (project) => {
            assert.equal(project.project_category, 1);
          });

          done();
        }).catch(error => done(error));
    });
  });
});
