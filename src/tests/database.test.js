const _ = require('lodash');
const assert = require('assert');

const DatabaseWrapper = require('../components/DatabaseWrapper/DatabaseWrapper');

const databaseWrapper = new DatabaseWrapper();

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
  });
});
