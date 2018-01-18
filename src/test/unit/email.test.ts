import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';

import { Configuration } from '../..//configuration';
import { Email, IEmailContent, IEmailOptions } from '../..//email';

const config = new Configuration('mercury', 'mercury.json');
const email = new Email(config.getKey('email'));

if (_.isNil(process.env.TRAVIS)) {
  describe('#Email', () => {
    describe('#verify', () => {
      it('Should return true if the service is online', () => {
        return email.verify()
          .then((done: boolean) => {
            assert.equal(done, true, 'Verify should resolve true if the service is online');
            assert.equal(email.online, true, 'email.online should be marked as true when verify passes');
          },    (error: Error) => {
            assert(false, error.message);
          });
      });

      it('Should throw a error when the service is offline', () => {
        const emailOptions: IEmailOptions = Object.assign({}, config.getKey('email'));
        emailOptions.password = 'wrong';

        const emailClient = new Email(emailOptions);

        return emailClient.verify()
          .then((done: boolean) => {
            assert(false, `Shouldn\'t verify correctly if the service is offline, done=${done}`);
          },    (error: Error) => {
            assert.equal(emailClient.online, false, 'online status should be false if it did not verify');
          });
      });
    });

    describe('#sendStoredEmails', () => {
      const emailConfig = Object.assign({}, config.getKey('email'));
      const sendStored = new Email(emailConfig);
      const jsonPath: string = sendStored.getEmailJsonPath();

      sendStored.online = true;

      it('Should resolve the empty array if the emails are empty', () => {
        return sendStored.sendStoredEmails(jsonPath, [])
          .then((emails: { emails: IEmailContent[] }) => {
            assert.equal(_.isNil(emails.emails[0]), true, `stored emails are empty the returned should be empty, array=${emails.emails}`);
          },    (error: Error) => assert(false, error.message));
      });

      it('should reject if online is marked as false', () => {
        const sendStoredoffline = new Email(config.getKey('email'));
        sendStoredoffline.online = false;

        return sendStoredoffline.sendStoredEmails(jsonPath)
          .then(() => assert(false, 'Should not resolve if the online status is marked as false'), (error: Error) => {
            assert.equal(sendStoredoffline.online, false, 'Online should be marked as false when rejecting');
          });
      });

      it('Should attempt to send all stored late emails, empty array should be returned', () => {
        const stored = [{
          from: emailConfig.email,
          html: '0',
          subject: 'npm testing subject',
          text: '0',
          to: emailConfig.email,
        },
          {
            from: emailConfig.email,
            html: '1',
            subject: 'npm testing subject',
            text: '1',
            to: emailConfig.email,
          }];

        return sendStored.sendStoredEmails(jsonPath, stored)
        .then((emails: { emails: IEmailContent[] }) => {
          assert.equal(_.isNil(emails.emails[0]), true, 'If stored emails are empty the returned array should be empty');
        },    (error: Error) => assert(false, error.message));
      });
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
      const serviceEmail = new Email(config.getKey('email'));
      const serviceConfig = config.getKey('email');

      it('should reject if secure is missing from the passed details', () => {
        const updatedDetails: any = {
          service: serviceEmail.getService(),
          user: serviceEmail.username,
        };

        return serviceEmail.updateServiceDetails(updatedDetails, serviceConfig.password)
          .then((done: boolean) => {
            assert(false, `Shouldn\'t resolve if secure is missing, done=${done}`);
          },    (error: Error) => assert(true, error.message));
      });

      it('should reject if user is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          service: serviceEmail.getService(),
        };

        return serviceEmail.updateServiceDetails(updatedDetails, serviceConfig.password)
          .then((done: boolean) => {
            assert(false, 'Shouldn\'t resolve if user is missing');
          },    (error: Error) => assert(true, error.message));
      });

      it('should reject if service is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          user: serviceEmail.username,
        };

        return serviceEmail.updateServiceDetails(updatedDetails, serviceConfig.password)
          .then((done: boolean) => {
            assert(false, 'Shouldn\'t resolve if service is missing');
          },    (error: Error) => assert(true, error.message));
      });
      it('Should reject verify if service details are wrong', () => {
        const updatedDetails: any = {
          secure: true,
          service: serviceEmail.getService(),
          user: serviceEmail.username,
        };

        const username = serviceEmail.username;

        return serviceEmail.updateServiceDetails(updatedDetails, 'wrong')
          .then((done: boolean) => {
            assert(false, `Shouldn\'t resolve if secure is missing, done=${done}`);
          },    (error: Error) => {
            serviceEmail.username = username;
            assert(true);
          });
      });
    });

    describe('#updateServicePassword', () => {
      const updateEmailClient = new Email(config.getKey('email'));
      const emailConfig: IEmailOptions = config.getKey('email');

      it('Should resolve verified if the updated password works', () => {
        return updateEmailClient.updateServicePassword(emailConfig.password)
          .then((done: boolean) => assert.equal(done, true, `Should resolve true when the password is correct, done=${done}`),
                (error: Error) => assert(false, `${error.message}, user=${updateEmailClient.username}`));
      });

      it('Should reject if the password is wrong', () => {
        return updateEmailClient.updateServicePassword('wrong')
          .then((done: boolean) => assert.equal(done, false, `Should reject when the password is incorrect, done=${done}`),
                (error: Error) => assert(true, error.message));
      });
    });

    describe('#getStoredEmails', () => {
      it('Should get a array of stored emails', () => {
        const storedEmails: { emails: IEmailContent[] } = email.getStoredEmails();

        assert.equal(_.isNil(storedEmails.emails), false, 'Email array should exist even if no emails exist');
        assert.equal(_.isArray(storedEmails.emails), true, 'Emails array should be a valid array and not anything else');

        if (_.isNil(storedEmails.emails[0])) { return assert(true); }

        _.forEach(storedEmails.emails, (storedEmail: IEmailContent) => {
          assert.equal(_.isNil(storedEmail.html), false, 'Each email should contain the html field');
          assert.equal(_.isNil(storedEmail.subject), false, 'Each email should contain the subject field');
          assert.equal(_.isNil(storedEmail.text), false, 'Each email should contain the text field');
          assert.equal(_.isNil(storedEmail.to), false, 'Each email should contain the to field');
        });
      });
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

    describe('#send', () => {
      const sendConfig: IEmailOptions = Object.assign({}, config.getKey('email'));
      const replacement: any = null;

      it('Should attempt to send the message if all requiremenets are given', () => {

        return email.send(sendConfig.email, sendConfig.email, 'test subject', 'test text', 'test text')
          .then((info: any) => {
            assert.equal(_.isNil(info), false, 'Info should be returned when the email attempted to be sent');
            assert.equal(_.isObject(info), true, `info returned should be a valid object of email info, info=${JSON.stringify(info)}`);
            assert.equal(info.accepted[0], sendConfig.email, 'Email should be accepted when the email is sent');

          },    (error: Error) => assert(false, error.message));
      });

      it('Should reject if to is missing from the build requirements', () => {
        return email.send(sendConfig.email, replacement, 'text', 'text' ,'text')
          .then(() => {
            assert(false, 'Email shouldn\'t attempt to send when to is missing from requirements');
          },    (error: Error) => assert(true));
      });

      it('Should reject if subject is missing from the build requirements', () => {
        return email.send(sendConfig.email, sendConfig.email, replacement, 'text' ,'text')
          .then(() => {
            assert(false, 'Email shouldn\'t attempt to send when subject is missing from requirements');
          },    (error: Error) => assert(true));
      });

      it('Should reject if text is missing from the build requirements', () => {
        return email.send(sendConfig.email, sendConfig.email, 'text', replacement ,'text')
          .then(() => {
            assert(false, 'Email shouldn\'t attempt to send when text is missing from requirements');
          },    (error: Error) => assert(true));
      });

      it('Should reject if html is missing from the build requirements', () => {
        return email.send(sendConfig.email, sendConfig.email, 'text', 'text' , replacement)
          .then(() => {
            assert(false, 'Email shouldn\'t attempt to send when html is missing from requirements');
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
