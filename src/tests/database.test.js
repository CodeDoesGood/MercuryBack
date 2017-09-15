const _ = require('lodash');
const assert = require('assert');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');
const DatabaseWrapper = require('../components/DatabaseWrapper');

const config = new ConfigurationWrapper('mercury', 'mercury.json');
const databaseWrapper = new DatabaseWrapper(config.getKey('database'));

databaseWrapper.showMessage = false;

describe('Database Wrapper', () => {
  describe('#getOnlineStatus', () => {
    it('Should return true if online', () => {
      databaseWrapper.online = true;
      const onlineStatus = databaseWrapper.getOnlineStatus();
      assert.equal(onlineStatus, true);
    });

    it('Should return false if online is false', () => {
      databaseWrapper.online = false;

      const onlineStatus = databaseWrapper.getOnlineStatus();
      assert.equal(onlineStatus, false);
    });
  });

  describe('#saltAndHash', () => {
    const password = databaseWrapper.saltAndHash('password');

    it('Should return a hashed pasword ands salt', () => {
      assert.equal(!_.isNil(password.hashedPassword), true, 'Hashed password was not given when salting and hashing a string');
      assert.equal(!_.isNil(password.salt), true, 'salt was not given when salting and hashing a string');
    });

    it('Should both be strings, salt and hash', () => {
      assert.equal(_.isString(password.hashedPassword), true, 'Hashed password was not a string when salting and hashing a string');
      assert.equal(_.isString(password.salt), true, 'salt was not a string when salting and hashing a string');
    });

    it('Should validate the salt and hash if the salt is passed', () => {
      const compareablePassword = databaseWrapper.saltAndHash('password', password.salt);
      assert.equal(compareablePassword.hashedPassword, password.hashedPassword, 'Password salted with stored salt do not match');
    });

    it('Should be a invalid match when entering the wrong salt', () => {
      const compareablePassword = databaseWrapper.saltAndHash('password', `${password.salt}wrongsalt`);
      assert.equal(compareablePassword.hashedPassword === password.hashedPassword, false, 'Password salted with wrong salt should not match');
    });

    it('Should be a invalid match when entering the wrong password but correct salt', () => {
      const compareablePassword = databaseWrapper.saltAndHash('wrongpassword', password.salt);
      assert.equal(compareablePassword.hashedPassword === password.hashedPassword, false, 'Password salted with wrong password should not match');
    });

    it('Should be a invalid match when entering the wrong password and wrong salt', () => {
      const compareablePassword = databaseWrapper.saltAndHash('wrongpassword', `${password.salt}wrongsalt`);
      assert.equal(compareablePassword.hashedPassword === password.hashedPassword, false, 'Password salted with wrong password should not match');
    });

    it('Should allow entering a number and conver the number to a string', () => {
      const testPassword = databaseWrapper.saltAndHash(10101010101010);
      assert.equal(!_.isNil(testPassword.hashedPassword), true, 'Hashed password was not given when salting and hashing a string');
      assert.equal(!_.isNil(testPassword.salt), true, 'salt was not given when salting and hashing a string');
    });
  });

  if (!_.isNil(process.env.TRAVIS)) {
    return;
  }

  describe('#connect', () => {
    it('Should resolve if the connection details are correct', (done) => {
      databaseWrapper.connect()
        .then(() => done())
        .catch(error => done(new Error(`Shouldn't reject if the connection details are correct, error=${error}`)));
    });

    it('Should reject if the connection details are correct', (done) => {
      const databaseNull = new DatabaseWrapper(config.getKey('database'));
      databaseNull.info.connection.password = 'wrong';

      databaseNull.connect()
        .then(() => done(new Error('Shouldn\'t resolve if the connection details are wrong')))
        .catch(() => done());

      databaseNull.info.connection.password = 'password';
    });
  });

  describe('#doesEmailExist', () => {
    it('Should reject if the email does not exist', (done) => {
      databaseWrapper.doesEmailExist('Emaildoesnotexist@exist.com')
        .then(() => done(new Error('Shouldn\'t resolve if the email does not exist')))
        .catch(() => done());
    });
    it('Shoudld resolve if the email does nexist', (done) => {
      databaseWrapper.doesEmailExist('Alys.DURHA2665@gmail.com')
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if no email is passed at all', (done) => {
      databaseWrapper.doesEmailExist(null)
        .then(() => done(new Error('Shouldn\'t resolve if no email is passed')))
        .catch(() => done());
    });

    it('Should reject if there is no user stored with that email', (done) => {
      databaseWrapper.doesUsernameExist('randomusername')
        .then(() => done(new Error('Shouldn\'t resolve if no username is passed')))
        .catch(() => done());
    });
  });

  describe('#doesUsernameExist', () => {
    it('Should reject if the username does not exist', (done) => {
      databaseWrapper.doesUsernameExist('user11')
        .then(() => done(new Error('Shouldn\'t resolve if the email does not exist')))
        .catch(() => done());
    });

    it('Shoudld resolve if the email does nexist', (done) => {
      databaseWrapper.doesUsernameExist('user1')
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if no username is passed at all', (done) => {
      databaseWrapper.doesUsernameExist(null)
        .then(() => done(new Error('Shouldn\'t resolve if no username is passed')))
        .catch(() => done());
    });

    it('Should reject if there is no user stored with that username', (done) => {
      databaseWrapper.doesUsernameExist('randomusername')
        .then(() => done(new Error('Shouldn\'t resolve if no username is passed')))
        .catch(() => done());
    });
  });
});
