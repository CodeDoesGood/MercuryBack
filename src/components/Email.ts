import * as Promise from 'bluebird';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';

import { logger } from './Logger';

export interface IEmailOptions {
  service: string;
  email: string;
  password: string;
  stored: string;
}

export interface IEmailContent {
  [index: string]: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface IBuiltMessage {
  from: string;
  html: string;
  subject: string;
  text: string;
  to: string;
}

export default class Email {
  public username: string;
  public online: boolean;

  private service: string;
  private stored: string;
  private transporter: nodemailer.Transporter;

  constructor(options: IEmailOptions) {
    // The type of service used for emailing.
    this.service = options.service;

    // The email that will be used to make the connection.
    this.username = options.email;

    this.stored = options.stored;

    // Transporter that will be sending the emails
    this.transporter = this.build(options.password);

    // Status for checking that the email connection is working.
    this.online = false;
  }

 /**
  * Take any stored emails in sthe email path and send them when the connection system is up
  * @param jsonPath The path to the json file of the stored emails to be send later
  */
  public sendStoredEmails(jsonPath: string): Promise<{ emails: IEmailContent[] } | Error> {
    if (!this.online) {
      return Promise.reject(new Error(`[Email] Service must be online to send stored emails`));
    }

    // If the file does not exist already we shall create it but resolve as there is no emails to be sent.
    if (!fs.existsSync(jsonPath)) {
      const template: { emails: any } = { emails: [] };

      fs.writeFileSync(jsonPath, JSON.stringify(template, null, '\t'));
      logger.info(`[Email] Stored json file does not exist to retrieve late email content, creating...`);
      return Promise.resolve(template);
    }

    const storedEmails: { emails: IEmailContent[] } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const updatedStoredEmails: { emails: IEmailContent[] } = { emails: storedEmails.emails.slice() };
    let sentEmails: number = 0;

    if (_.isNil(storedEmails.emails[0])) {
      logger.info(`[Email] No late stored emails to send 😊`);
      return Promise.resolve(storedEmails);
    }

    _.forEach(storedEmails.emails, (email: IEmailContent, index) => {
      this.send(this.username, email.to, email.subject, email.text, email.html)
      .then((info: nodemailer.SentMessageInfo) => {
        logger.info(`[Email] Sent stored email: ${info.messageId}`);
        updatedStoredEmails.emails.splice(index, 1);
      })
      .finally(() => {
        sentEmails += 1;

        if (sentEmails === storedEmails.emails.length) {
          fs.writeFileSync(jsonPath, JSON.stringify(updatedStoredEmails, null, '\t'));
          return Promise.resolve(updatedStoredEmails);
        }
      })
      .catch((error: Error) => logger.warn(`[Email] Failed to send store email ${error.message}`));
    });
  }

  /**
   * Sends a email to the provided person with the provided content.
   * @param {string} to The person who is getting sent the email.
   * @param {string} subject The subject text for the email.
   * @param {string} text  The content text for the email.
   * @param {undefined} html The html to be used instead of the text (defaults to the text)
   */
  public send(from: string, to: string, subject: string, text: string, html?: string): Promise<nodemailer.SentMessageInfo | Error> {
    const content = [
      { name: 'from', type: from },
      { name: 'subject', type: subject },
      { name: 'text', type: text },
      { name: 'to', type: to },
    ];

    _.forEach(content, (item) => {
      if (_.isNil(item.type) || !_.isString(item.type)) {
        throw new Error(`${item.name} has to be specified and of type string`);
      }
    });

    return new Promise((resolve, reject) => {
      const message = this.buildMessage({
        from, html, subject, text, to,
      });
      this.transporter.sendMail(message, (error: Error, info: nodemailer.SentMessageInfo) => {
        if (!_.isNil(error)) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  /**
   * Verifies the connection the service.
   */
  public verify(): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      this.transporter.verify((error: Error, result: boolean) => {
        if (!_.isNil(error)) {
          this.online = false;
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Get the online status of the email service
   */
  public getStatus(): boolean {
    return this.online;
  }

  /**
   * returns email service
   */
  public getService() {
    return this.service;
  }

  /**
   * returns json path for late emails
   */
  public getEmailJsonPath() {
    return this.stored;
  }

  /**
   * returns stored late emails that are stored in the json file.
   */
  public getStoredEmails() {
    const jsonPath: string = this.getEmailJsonPath();

    // If the file does not exist already we shall create it but resolve as there is no emails to be sent.
    if (!fs.existsSync(jsonPath)) {
      const template: { emails: any } = { emails: [] };

      fs.writeFileSync(jsonPath, JSON.stringify(template, null, '\t'));
      logger.info(`[Email] Stored json file does not exist to retrieve late email content, creating...`);
      return { emails: [] };
    }

    const storedEmails: { emails: IEmailContent[] } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    return storedEmails;
  }

  /**
   * Builds the transporter from nodemailer that will be used to send the emails.
   * @param {string} pass The password that is being used to authenticate with the service.
   */
  private build(pass: string): nodemailer.Transporter {
    return nodemailer.createTransport({
      auth: {
        pass,
        user: this.username,
      },
      secure: true,
      service: this.service,
    });
  }

  /**
   * Returns a build object ready to be passed into the transporter for sending a email.
   * @param {IEmailContent} content The object containing the message details,
   * from, to, subject, text, html.
   */
  private buildMessage(content: IEmailContent): IBuiltMessage {
    if (!_.isObject(content)) {
      throw new Error('Build message must be of type string');
    }

    const buildRequirements = ['to', 'subject', 'text', 'html'];

    const message = _.pick(content, buildRequirements);

    _.forEach(buildRequirements, (item) => {
      if (_.isNil(message[item]) || !_.isString(message[item])) {
        throw new Error(`${item} must be provided and of type string`);
      }
    });

    return {
      from: this.username,
      html: _.defaultTo(message.html, message.text),
      subject: message.subject,
      text: message.text,
      to: message.to,
    };
  }
}
