const assert = require('assert');
const fs = require('fs');

const ConfigurationWrapper = require('../components/Configuration/ConfigurationWrapper');

describe('#configurationWrapper', () => {
  describe('#load', () => {
    it('Should return the default configuration if it does not exist', () => {
      let config = new ConfigurationWrapper('foldername', 'file.json');

      assert.equal(config.getConfiguration(), config.default, 'If the file does not exist then the default configuration should be returned');

      fs.unlinkSync(config.path);
      fs.rmdirSync(`${config.homeDirectory}${config.folder}`);

      config = null;
    });

    it('Should return the stored configuration if it does exists', () => {
      let config = new ConfigurationWrapper('mercury', 'mercury.json');

      assert.equal(config.getConfiguration() === config.getDefault(), false, 'Configuration sholdn\'t match default if the configuration file already existed');

      config = null;
    });
  });

  describe('#update', () => {
    it('Should update the stored content in memory', () => {
      let config = new ConfigurationWrapper('mercury', 'mercury.json');

      const oldConfig = config.getConfiguration();
      const updatedConfig = Object.assign({}, oldConfig, { updated: true });

      config.update(updatedConfig);

      assert.equal(config.getConfiguration() === oldConfig, false, 'Updated config should not be the same as the old config');

      config.update(oldConfig);

      config = null;
    });

    it('Should update the stored content in the file on the disk', () => {
      let config = new ConfigurationWrapper('mercury', 'mercury.json');

      const oldConfig = config.getConfiguration();
      const updatedConfig = Object.assign({}, oldConfig, { updated: true });

      config.update(updatedConfig);

      const diskConfig = JSON.parse(fs.readFileSync(config.path, 'utf8'));

      assert.equal(updatedConfig.updated, diskConfig.updated, 'Disk config should match the updated config in memory');

      config.update(oldConfig);

      config = null;
    });
  });
});
