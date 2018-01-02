import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';

import Configuration from '../components/Configuration/Configuration';
import Email from '../components/Email';

const config = new Configuration('mercury', 'mercury.json');
const email = new Email(config.getKey('email'));

if (_.isNil(process.env.TRAVIS)) {
  describe.only('#Email', () => {
    describe('#sendStoredEmails', () => {
      it('', () => { throw new Error('Not Complete'); });
      it('', () => { throw new Error('Not Complete'); });
    });

    describe('#send', () => {
      it('', () => { throw new Error('Not Complete'); });
      it('', () => { throw new Error('Not Complete'); });
    });

    describe('#verify', () => {
      it('Should return true if the service is online', () => { throw new Error('Not Complete'); }); // check this.online as well
      it('Should throw a error when the service is offline', () => { throw new Error('Not Complete'); }); // check this.online as well
    });

    describe('#getStatus', () => {
      it('Should return true if the service is online', () => { throw new Error('Not Complete'); });
      it('Should return false if the service is false', () => { throw new Error('Not Complete'); });
    });

    describe('#getService', () => {
      it('Should return the same service as stored in the config', () => {
        assert.equal(config.getKey('email').service, email.getService(), 'Services should match, config and email service base');
      });
    });

    describe('#getEmailJsonPath', () => {
      it('Should return a string json path that exists', () => {
        const jsonPath = email.getEmailJsonPath();

        assert.equal(fs.existsSync(jsonPath), true, 'Path given by jsonPath should exist');
      });
    });

    describe('#getServiceConfig', () => {
      it('Should return the config that matches the stored version', () => {
        const services = email.getServiceConfig();
        const storedService = config.getKey('email');

        assert.equal(services.service, storedService.service, 'service status should match in both config and client');
        assert.equal(services.user, storedService.email, 'username status should match in both config and client');
      });
    });

    describe('#updateServiceDetails', () => {
      it('', () => { throw new Error('Not Complete'); });
      it('', () => { throw new Error('Not Complete'); });
    });

    describe('#updateServicePassword', () => {
      it('', () => { throw new Error('Not Complete'); });
      it('', () => { throw new Error('Not Complete'); });
    });

    describe('#getStoredEmails', () => {
      it('Should get stored email json if emails exist', () => { throw new Error('Not Complete'); });
      it('Should get a empty array if no emails exist', () => { throw new Error('Not Complete'); });
    });

    describe('#removeStoredEmailByIndex', () => {
      it('Should remove a email by index if it exists', () => { throw new Error('Not Complete'); });
      it('Should throw a error if no email exists at that index', () => { throw new Error('Not Complete');});
    });

    describe('#replaceStoredEmailByIndex', () => {
      it('Should update a email by index if it exists', () => { throw new Error('Not Complete'); });
      it('Should throw a error if no email exists at that index', () => { throw new Error('Not Complete');});
    });
 
}
