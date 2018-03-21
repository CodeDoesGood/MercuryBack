import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';

import { Configuration } from '../..//configuration';
import { Email } from '../..//email';
import { EmailManager, IEmailContent, IEmailOptions } from '../../emailManager';

const config = new Configuration();
const emailManager = new EmailManager(config.getKey('email'));

if (_.isNil(process.env.TRAVIS)) {
  describe('#Email', () => {
    describe('#verify', () => {
      it('Should return true if the service is online', () => {
        return emailManager.verify().then(
          (done: boolean) => {
            assert.equal(done, true, 'Verify should resolve true if the service is online');
            assert.equal(emailManager.getEmailOnline(), true, 'email.online should be marked as true when verify passes');
          },
          (error: Error) => {
            assert(false, error.message);
          },
        );
      });

      it('Should throw a error when the service is offline', () => {
        const emailOptions: IEmailOptions = Object.assign({}, config.getKey('email'));
        emailOptions.password = 'wrong';

        const emailClient = new EmailManager(emailOptions);

        return emailClient.verify().then(
          (done: boolean) => {
            assert(false, `Shouldn\'t verify correctly if the service is offline, done=${done}`);
          },
          (error: Error) => {
            assert.equal(emailClient.getEmailOnline(), false, 'online status should be false if it did not verify');
          },
        );
      });
    });

    describe('#sendStoredEmails', () => {
      const emailConfig = Object.assign({}, config.getKey('email'));
      const sendStored = new EmailManager(emailConfig);
      const jsonPath: string = sendStored.getEmailJSONPath();

      sendStored.setEmailOnline(true);

      it('Should resolve the empty array if the emails are empty', () => {
        return sendStored.sendStoredEmails(jsonPath, []).then(
          (emails: { emails: IEmailContent[] }) => {
            assert.equal(_.isNil(emails.emails[0]), true, `stored emails are empty the returned should be empty, array=${emails.emails}`);
          },
          (error: Error) => assert(false, error.message),
        );
      });

      it('should reject if online is marked as false', () => {
        const sendStoredoffline = new EmailManager(config.getKey('email'));
        sendStoredoffline.setEmailOnline(false);

        return sendStoredoffline.sendStoredEmails(jsonPath).then(
          () => assert(false, 'Should not resolve if the online status is marked as false'),
          (error: Error) => {
            assert.equal(sendStoredoffline.getEmailOnline(), false, 'Online should be marked as false when rejecting');
          },
        );
      });

      it('Should attempt to send all stored late emails, empty array should be returned', () => {
        const stored = [
          {
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
          },
        ];

        return sendStored.sendStoredEmails(jsonPath, stored).then(
          (emails: { emails: IEmailContent[] }) => {
            assert.equal(_.isNil(emails.emails[0]), true, 'If stored emails are empty the returned array should be empty');
          },
          (error: Error) => assert(false, error.message),
        );
      });
    });

    describe('#getService', () => {
      it('Should return the same service as stored in the config', () => {
        assert.equal(config.getKey('email').service, emailManager.getService(), 'Services should match, config and email service base');
      });
    });

    describe('#getEmailJsonPath', () => {
      it('Should return a string json path that exists', () => {
        const jsonPath = emailManager.getEmailJSONPath();

        assert.equal(fs.existsSync(jsonPath), true, 'Path given by jsonPath should exist');
      });
    });

    describe('#getServiceConfig', () => {
      it('Should return the config that matches the stored version', () => {
        const services = emailManager.getServiceConfig();
        const storedService = config.getKey('email');

        assert.equal(services.service, storedService.service, 'service status should match in both config and client');
        assert.equal(services.user, storedService.email, 'username status should match in both config and client');
      });
    });

    describe('#updateServiceDetails', () => {
      const serviceEmail = new EmailManager(config.getKey('email'));
      const serviceConfig = config.getKey('email');

      it('should reject if secure is missing from the passed details', () => {
        const updatedDetails: any = {
          service: serviceEmail.getService(),
          user: serviceEmail.getUsername(),
        };

        return serviceEmail.updateServiceDetails(updatedDetails, serviceConfig.password).then(
          (done: boolean) => {
            assert(false, `Shouldn\'t resolve if secure is missing, done=${done}`);
          },
          (error: Error) => assert(true, error.message),
        );
      });

      it('should reject if user is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          service: serviceEmail.getService(),
        };

        return serviceEmail.updateServiceDetails(updatedDetails, serviceConfig.password).then(
          (done: boolean) => {
            assert(false, 'Shouldnt resolve if user is missing');
          },
          (error: Error) => assert(true, error.message),
        );
      });

      it('should reject if service is missing from the passed details', () => {
        const updatedDetails: any = {
          secure: true,
          user: serviceEmail.getUsername(),
        };

        return serviceEmail.updateServiceDetails(updatedDetails, serviceConfig.password).then(
          (done: boolean) => {
            assert(false, 'Shouldnt resolve if service is missing');
          },
          (error: Error) => assert(true, error.message),
        );
      });
    });

    describe('#updateServicePassword', () => {
      const upEmail = new EmailManager(config.getKey('email'));
      const emailConfig: IEmailOptions = config.getKey('email');

      it('Should resolve verified if the updated password works', () => {
        return upEmail
          .updateServicePassword(emailConfig.password)
          .then(
            () =>
              assert.equal(upEmail.getEmailOnline(), true, `Should resolve when the password is correct, done=${upEmail.getEmailOnline()}`),
            (error: Error) => assert(false, `${error.message}, user=${upEmail.getUsername()}`),
          );
      });

      it('Should reject if the password is wrong', () => {
        return upEmail
          .updateServicePassword('wrong')
          .then(
            (done: boolean) => assert.equal(done, false, `Should reject when the password is incorrect, done=${done}`),
            (error: Error) => assert(true, error.message),
          );
      });
    });

    describe('#getStoredEmails', () => {
      it('Should get a array of stored emails', () => {
        const storedEmails: { emails: IEmailContent[] } = emailManager.getStoredEmails();

        assert.equal(_.isNil(storedEmails.emails), false, 'Email array should exist even if no emails exist');
        assert.equal(_.isArray(storedEmails.emails), true, 'Emails array should be a valid array and not anything else');

        if (_.isNil(storedEmails.emails[0])) {
          return assert(true);
        }

        _.forEach(storedEmails.emails, (storedEmail: IEmailContent) => {
          assert.equal(_.isNil(storedEmail.html), false, 'Each email should contain the html field');
          assert.equal(_.isNil(storedEmail.subject), false, 'Each email should contain the subject field');
          assert.equal(_.isNil(storedEmail.text), false, 'Each email should contain the text field');
          assert.equal(_.isNil(storedEmail.to), false, 'Each email should contain the to field');
        });
      });
    });

    describe('#removeStoredEmailByIndex', () => {
      const emailsStored = emailManager.getStoredEmails();

      const exampleStoredEmails = [
        {
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
        },
      ];

      it('Should remove a email by index if it exists', () => {
        const storedEmails = { emails: exampleStoredEmails.slice() };

        return emailManager.removeStoredEmailByIndex(0, storedEmails).then(
          (updated: IEmailContent[]) => {
            assert.equal(updated[0].html, '1', 'Updated emails should have index 1 as index 0 after removing first index');
          },
          (error: Error) => assert(false, error.message),
        );
      });

      it('Should throw a error if no email exists at that index', () => {
        const storedEmails = { emails: exampleStoredEmails.slice() };

        return emailManager.removeStoredEmailByIndex(Number.MAX_SAFE_INTEGER, storedEmails).then(
          (updated: IEmailContent[]) => {
            assert(false, `No email exists at that index, index: ${Number.MAX_SAFE_INTEGER}, len: ${storedEmails.emails.length}`);
          },
          (error: Error) => assert(true),
        );
      });
    });

    describe('#send', () => {
      const sendConfig: IEmailOptions = Object.assign({}, config.getKey('email'));
      const replacement: any = null;

      it('Should attempt to send the message if all requiremenets are given', () => {
        const email = new Email(sendConfig.email, 'test subject', 'test text', 'test text');

        return emailManager.send(email).then(
          (info: any) => {
            assert.equal(_.isNil(info), false, 'Info should be returned when the email attempted to be sent');
            assert.equal(_.isObject(info), true, `info returned should be a valid object of email info, info=${JSON.stringify(info)}`);
            assert.equal(info.accepted[0], sendConfig.email, 'Email should be accepted when the email is sent');
          },
          (error: Error) => assert(false, error.message),
        );
      });

      it('Should reject if any email content is missing from the build requirements', () => {
        try {
          const email = new Email(sendConfig.email, 'text', replacement, 'test text');
          assert(false, 'Email shouldnt attempt to send when subject is missing from requirements');
        } catch (error) {
          assert(true);
        }
      });
    });

    describe('#replaceStoredEmailByIndex', () => {
      const emailsStored = emailManager.getStoredEmails();

      const exampleStoredEmails = [
        {
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
        },
      ];

      it('Should update a email by index if it exists', () => {
        const storedEmails = { emails: exampleStoredEmails.slice() };
        const replacement = {
          from: 'updated',
          html: 'updated',
          subject: 'updated',
          text: 'updated',
          to: 'updated',
        };

        return emailManager.replaceStoredEmailByIndex(0, replacement, storedEmails).then(
          (updated: IEmailContent[]) => {
            assert.equal(updated[0].html, 'updated', 'Should update a email by index if it exists');
          },
          (error: Error) => assert(false, error.message),
        );
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

        return emailManager.replaceStoredEmailByIndex(Number.MAX_SAFE_INTEGER, replacement, storedEmails).then(
          (updated: IEmailContent[]) => {
            assert(false, `no email exists at that index: ${Number.MAX_SAFE_INTEGER}, len: ${storedEmails.emails.length}`);
          },
          (error: Error) => assert(true),
        );
      });
    });
  });
}
