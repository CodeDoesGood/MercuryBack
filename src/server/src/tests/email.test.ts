import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';

import Configuration from '../components/Configuration/Configuration';
import Email, { IEmailContent } from '../components/Email';

const config = new Configuration('mercury', 'mercury.json');
const email = new Email(config.getKey('email'));

if (_.isNil(process.env.TRAVIS)) {
  describe('#Email', () => {
    describe('#verify', () => {
      it('Should return true if the service is online', () => { assert(false, 'Not Complete'); }); // check this.online as well
      it('Should throw a error when the service is offline', () => { assert(false, 'Not Complete'); }); // check this.online as well
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
      it('should reject if secure is missing from the passed details', () => {
        const updatedDetails: any = {
          service: email.getService(),
          user: email.username,
        };

        return email.updateServiceDetails(updatedDetails, config.getKey('email').password)
          .then((done: boolean) => {
            assert(false, `Shouldn\'t resolve if secure is missing, done=${done}`);
          },    (error: Error) => assert(true, error.message));
      });

      it('should reject if user is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          service: email.getService(),
        };

        return email.updateServiceDetails(updatedDetails, config.getKey('email').password)
          .then((done: boolean) => {
            assert(false, 'Shouldn\'t resolve if user is missing');
          },    (error: Error) => assert(true, error.message));
      });

      it('should reject if service is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          user: email.username,
        };

        return email.updateServiceDetails(updatedDetails, config.getKey('email').password)
          .then((done: boolean) => {
            assert(false, 'Shouldn\'t resolve if service is missing');
          },    (error: Error) => assert(true, error.message));
      });
      it('Should reject verify if service details are wrong', () => {
        const updatedDetails: any = {
          secure: true,
          service: email.getService(),
          user: email.username,
        };

        const username = email.username;

        return email.updateServiceDetails(updatedDetails, 'wrong')
          .then((done: boolean) => {
            assert(false, `Shouldn\'t resolve if secure is missing, done=${done}`);
          },    (error: Error) => {
            email.username = username;
            assert(true);
          });
      });
    });

    describe('#updateServicePassword', () => {
      it('Should resolve verified if the updated password works', () => { assert(false, 'Not Complete'); });
      it('Should reject if the password is wrong', () => { assert(false, 'Not Complete'); });
    });

    describe('#getStoredEmails', () => {
      it('Should get stored email json if emails exist', () => { assert(false, 'Not Complete'); });
      it('Should get a empty array if no emails exist', () => { assert(false, 'Not Complete'); });
    });

    describe('#removeStoredEmailByIndex', () => {
      const emailsStored = email.getStoredEmails();

      const exampleStoredEmails = [{
        from: 'sending address',
        html: '0',
        subject: 'subject',
        text: '0',
        to: 'receiver',
      },
        {
          from: 'sending address',
          html: '1',
          subject: 'subject',
          text: '1',
          to: 'receiver',
        },
        {
          from: 'sending address',
          html: '2',
          subject: 'subject',
          text: '2',
          to: 'receiver',
        }];

      it('Should remove a email by index if it exists', () => {
        const storedEmails = { emails: exampleStoredEmails.slice() };

        return email.removeStoredEmailByIndex(0, storedEmails)
          .then((updated: IEmailContent[]) => {
            assert.equal(updated[0].html, '1', 'Updated emails should have index 1 as index 0 after removing first index');
          },    (error: Error) => assert(false, error.message));
      });

      it('Should throw a error if no email exists at that index', () => {
        const storedEmails = { emails: exampleStoredEmails.slice() };

        return email.removeStoredEmailByIndex(Number.MAX_SAFE_INTEGER, storedEmails)
          .then((updated: IEmailContent[]) => {
            assert(false, `No email exists at that index, index: ${Number.MAX_SAFE_INTEGER}, len: ${storedEmails.emails.length}`);
          },    (error: Error) => assert(true));
      });
    });

    describe('#replaceStoredEmailByIndex', () => {
      const emailsStored = email.getStoredEmails();

      const exampleStoredEmails = [{
        from: 'sending address',
        html: '0',
        subject: 'subject',
        text: '0',
        to: 'receiver',
      },
        {
          from: 'sending address',
          html: '2',
          subject: 'subject',
          text: '2',
          to: 'receiver',
        }];

      it('Should update a email by index if it exists', () => {
        const storedEmails = { emails: exampleStoredEmails.slice() };
        const replacement = {
          from: 'updated',
          html: 'updated',
          subject: 'updated',
          text: 'updated',
          to: 'updated',
        };

        return email.replaceStoredEmailByIndex(0, replacement, storedEmails)
          .then((updated: IEmailContent[]) => {
            assert.equal(updated[0].html, 'updated', 'Should update a email by index if it exists');
          },    (error: Error) => assert(false, error.message));
      });

      it('Should throw a error if no email exists at that index', () => {
        const storedEmails = { emails: exampleStoredEmails.slice() };
        const replacement = {
          from: 'updated',
          html: 'updated',
          subject: 'updated',
          text: 'updated',
          to: 'updated',
        };

        return email.replaceStoredEmailByIndex(Number.MAX_SAFE_INTEGER, replacement, storedEmails)
          .then((updated: IEmailContent[]) => {
            assert(false, `no email exists at that index: ${Number.MAX_SAFE_INTEGER}, len: ${storedEmails.emails.length}`);
          },    (error: Error) => assert(true));
      });
    });
  });
}
