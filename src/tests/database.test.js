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
});
