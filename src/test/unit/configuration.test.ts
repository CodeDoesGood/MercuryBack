import * as assert from 'assert';
import * as fs from 'fs';

import { Configuration } from '../..//configuration';

describe('#configurationWrapper', () => {
  describe('#constructor', () => {
    it('should throw if folder is not passed', () => {
      const folder: any = undefined;

      try {
        const config = new Configuration();
        assert(false, 'Should throw a error if folder is not passed');
      } catch (error) {
        assert(true, error);
      }
    });

    it('should throw if the name is not passed', () => {
      const name: any = undefined;

      try {
        const config = new Configuration();
        assert(false, 'Should throw a error if name is not passed');
      } catch (error) {
        assert(true, error);
      }
    });

    it('should throw if folder is not a string', () => {
      const folder: any = 1;

      try {
        const config = new Configuration();
        assert(false, 'Should throw a error if folder is not a string');
      } catch (error) {
        assert(true, error);
      }
    });
    it('should throw if the name is not a string', () => {
      const name: any = 1;

      try {
        const config = new Configuration();
        assert(false, 'Should throw a error if name is not a string');
      } catch (error) {
        assert(true, error);
      }
    });
  });

  describe('#load', () => {
    it('Should return the stored configuration if it does exists', () => {
      let config = new Configuration();

      assert.equal(
        config.getConfiguration() === config.getDefault(),
        false,
        'Configuration sholdn\'t match default if the configuration file already existed',
      );

      config = null;
    });
  });

  describe('#update', () => {
    it('Should update the stored content in memory', () => {
      let config = new Configuration();

      const oldConfig = config.getConfiguration();
      const updatedConfig = Object.assign({}, oldConfig, { updated: true });

      config.update(updatedConfig);

      assert.equal(config.getConfiguration() === oldConfig, false, 'Updated config should not be the same as the old config');

      config.update(oldConfig);

      config = null;
    });

    it('Should update the stored content in the file on the disk', () => {
      let config = new Configuration();

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
