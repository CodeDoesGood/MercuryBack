import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';

import Configuration from '../components/Configuration/Configuration';
import Email, { IEmailServices } from '../components/Email';

const config = new Configuration('mercury', 'mercury.json');
const email = new Email(config.getKey('email'));

if (_.isNil(process.env.TRAVIS)) {
  describe('#Email', () => {
    describe('#verify', () => {
      it('Should return true if the service is online', () => { throw new Error('Not Complete'); }); // check this.online as well
      it('Should throw a error when the service is offline', () => { throw new Error('Not Complete'); }); // check this.online as well
    });

    describe('#getStatus', () => {
      it('Should return true if the service is online', () => {
        const currentEmailStatus = email.online;
        email.online = true;

        const status = email.getStatus();

        email.online = currentEmailStatus;

        assert.equal(status, true, 'Email status should return true if its marked as online');
      });
      it('Should return false if the service is false', () => {
        const currentEmailStatus = email.online;
        email.online = false;

        const status = email.getStatus();

        email.online = currentEmailStatus;

        assert.equal(status, false, 'Email status should return false if its marked as offline');
      });
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
      it('Shoudld reject if secure is missing from the passed details', () => {
        const updatedDetails: any = {
          service: email.getService(),
          user: email.username,
        };

        email.updateServiceDetails(updatedDetails, config.getKey('email').password)
          .then((done: boolean) => {
            throw new Error('Shouldn\'t resolve if secure is missing');
          },    (error: Error) => undefined);
      });

      it('Shoudld reject if user is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          service: email.getService(),
        };

        email.updateServiceDetails(updatedDetails, config.getKey('email').password)
          .then((done: boolean) => {
            throw new Error('Shouldn\'t resolve if user is missing');
          },    (error: Error) => undefined);
      });

      it('Shoudld reject if service is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          user: email.username,
        };

        email.updateServiceDetails(updatedDetails, config.getKey('email').password)
          .then((done: boolean) => {
            throw new Error('Shouldn\'t resolve if service is missing');
          },    (error: Error) => undefined);
      });
      it('Should reject verify if service details are wrong', () => {
        const updatedDetails: any = {
          secure: true,
          service: email.getService(),
          user: email.username,
        };

        const username = email.username;
        email.username = 'wrong';

        email.updateServiceDetails(updatedDetails, config.getKey('email').password)
          .then((done: boolean) => {
            throw new Error('Shouldn\'t resolve if service is missing');
          },    (error: Error) => email.username = username);
      });
    });

    describe('#updateServicePassword', () => {
      it('Should resolve verified if the updated password works', () => { throw new Error('Not Complete'); });
      it('Should reject if the password is wrong', () => { throw new Error('Not Complete'); });
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
  });
}
