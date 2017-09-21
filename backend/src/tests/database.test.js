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
    it('Should resolve if the connection details are correct', () => databaseWrapper.connect('username')
      .then(() => {
      }, (error) => { throw new Error(error); }));


    it('Should reject if the connection details are correct', () => {
      const databaseNull = new DatabaseWrapper(config.getKey('database'));
      databaseNull.info.connection.password = 'wrong';

      return databaseNull.connect()
        .then(() => {
          throw new Error('Shouldn\'t resolve if the connection details are wrong');
        }, () => {})
        .finally(() => {
          databaseNull.info.connection.password = 'password';
        });
    });
  });

  describe('#doesEmailExist', () => {
    it('Should reject if the email does not exist', () => databaseWrapper.doesEmailExist('Emaildoesnotexist@exist.com')
      .then(() => {
        throw new Error('Shouldn\'t resolve if the email does not exist');
      }, () => {}));

    it('Should resolve if the email does exist', () => databaseWrapper.doesEmailExist('Alys.DURHA2665@gmail.com')
      .then(() => {}, (error) => { throw new Error(error); }));

    it('Should reject if no email is passed at all', () => databaseWrapper.doesEmailExist(null)
      .then(() => {
        throw new Error('Shouldn\'t resolve if the email is not passed');
      }, () => {}));
  });

  describe('#doesUsernameExist', () => {
    it('Should reject if the username does not exist', () => databaseWrapper.doesUsernameExist('')
      .then(() => {
        throw new Error('Shouldn\'t resolve if the email does not exist');
      }, () => {}));

    it('Should resolve if the username does exist', () => databaseWrapper.doesUsernameExist('user1')
      .then(() => {}, (error) => { throw new Error(error); }));

    it('Should reject if no username is passed at all', () => databaseWrapper.doesUsernameExist(null)
      .then(() => {
        throw new Error('Shouldn\'t resolve if no username is passed');
      }, () => {}));
  });
});
