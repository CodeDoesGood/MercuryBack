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

export interface IEmailServices {
  user: string;
  secure: boolean;
  service: string;
}

export default class Email {
  public username: string;
  public online: boolean;

  private secure: boolean;
  private service: string;
  private stored: string;
  private transporter: nodemailer.Transporter;

  constructor(options: IEmailOptions) {
    this.service = options.service;
    this.username = options.email;

    this.online = false;
    this.secure = true;

    // Stored is the path to the stored json file that is curerntly used for the storing of emails
    // couldn't be sent, these would be seen and resent or adjusted by the administrators.
    this.stored = options.stored;

    // Transporter that will be sending the emails
    this.transporter = this.build(options.password);
  }

  /**
   * Attempt to send emails again that failed.
   * @param jsonPath The path to the json file
   * @param passedEmails Overhaul of json stored emails, if this is passed then the stored emails would not be retrieved
   */
  public async sendStoredEmails(jsonPath: string, passedEmails?: IEmailContent[]) {
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

    let storedEmails: { emails: IEmailContent[] } = null;

    if (_.isNil(passedEmails)) {
      storedEmails = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else {
      storedEmails = { emails: passedEmails };
    }

    const updatedStoredEmails: { emails: IEmailContent[] } = { emails: storedEmails.emails.slice() };

    let sentEmails: number = 0;

    if (_.isNil(storedEmails.emails[0])) {
      logger.info(`[Email] No late stored emails to send 😊`);
      return Promise.resolve(storedEmails);
    }

    return new Promise((resolve, reject) => {
      _.forEach(storedEmails.emails, (email: IEmailContent, index: number) => {
        this.send(this.username, email.to, email.subject, email.text, email.html)
          .then((info: nodemailer.SentMessageInfo) => {
            logger.info(`[Email] Sent stored email: ${info.messageId}`);
            updatedStoredEmails.emails.slice(index, 1);
            sentEmails += 1;

            if (sentEmails === storedEmails.emails.length) {
              if (_.isNil(passedEmails)) {
                fs.writeFileSync(jsonPath, JSON.stringify(updatedStoredEmails, null, '\t'));
              }
              resolve(updatedStoredEmails);
            }
          })
          .catch((error: Error) => logger.warn(`[Email] Failed to send store email ${error.message}`));
      });
    });
  }

  /**
   * Sends a email to the provided person with the provided content.
   * @param {string} to The person who is getting sent the email.
   * @param {string} subject The subject text for the email.
   * @param {string} text  The content text for the email.
   * @param {undefined} html The html to be used instead of the text (defaults to the text)
   */
  public async send(from: string, to: string, subject: string, text: string, html?: string): Promise<any> {
    const content = [
      { name: 'from', type: from },
      { name: 'subject', type: subject },
      { name: 'text', type: text },
      { name: 'to', type: to },
    ];

    return new Promise((resolve, reject) => {
      return this.buildMessage({ from, html, subject, text, to })
        .then((message: IBuiltMessage) => {
          this.transporter.sendMail(message, (error: Error, info: nodemailer.SentMessageInfo) => {
            if (!_.isNil(error)) {
              reject(error);
            } else {
              resolve(info);
            }
          });
        })
        .catch((error: Error) => reject(error));
    });
  }

  /**
   * Verifies the connection the service.
   */
  public async verify(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.transporter.verify((error: Error, result: boolean) => {
        if (!_.isNil(error)) {
          this.online = false;
          reject(error);
        } else {
          this.online = true;
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
   * Returns the current service configuration that is used to connect and make
   * the email client.
   */
  public getServiceConfig(): IEmailServices {
    return {
      secure: this.secure,
      service: this.service,
      user: this.username,
    };
  }

  /**
   * Updates the service details for the email client, allowing for live updating without
   * the need to restart the server
   * @param details Service details used for the update
   * @param password The password used for recreating the connection
   */
  public async updateServiceDetails(serviceContent: IEmailServices, password: string): Promise<boolean | Error> {
    const details = _.pick(serviceContent, ['secure', 'service', 'user']);

    if (_.isNil(details.secure) || _.isNil(details.user) || _.isNil(details.service)) {
      return Promise.reject('Service, secure and user is required whnen updating service details');
    }

    this.secure = details.secure;
    this.username = details.user;
    this.service = details.service;

    this.transporter = this.build(password);
    return this.verify();
  }

  /**
   * Replace and update the email service password
   * @param password The new password
   */
  public async updateServicePassword(password: string) {
    this.transporter = this.build(password);
    return this.verify();
  }

  /**
   * returns stored late emails that are stored in the json file.
   */
  public getStoredEmails(): { emails: IEmailContent[] } {
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
   * Attempts to rmeove a stored email by its index
   * @param index email index to remove
   * @param passedEmails Overhaul of json stored emails, if this is passed then the stored emails would not be retrieved
   */
  public async removeStoredEmailByIndex(index: number, passedEmails?: { emails: IEmailContent[] }): Promise<IEmailContent[] | Error> {
    const jsonPath: string = this.getEmailJsonPath();
    let storedEmails: { emails: IEmailContent[] };

    if (!_.isNil(passedEmails)) {
      storedEmails = passedEmails;
    } else {
      storedEmails = this.getStoredEmails();
    }

    if (index > storedEmails.emails.length) {
      return Promise.reject(new Error('Cannot remove email by index as index is out of range'));
    }

    storedEmails.emails.splice(index, 1);

    if (_.isNil(passedEmails)) {
      fs.writeFileSync(jsonPath, JSON.stringify({ emails: storedEmails.emails }, null, '\t'));
    }

    return Promise.resolve(storedEmails.emails);
  }

  /**
   * Replace a email index in the stored json
   * @param index the index of the email to update
   * @param email IEmailContent email to update
   */
  public async replaceStoredEmailByIndex(index, email, passedEmails?: { emails: IEmailContent[] }): Promise<IEmailContent[] | Error> {
    const jsonPath: string = this.getEmailJsonPath();
    let storedEmails: { emails: IEmailContent[] };

    if (!_.isNil(passedEmails)) {
      storedEmails = passedEmails;
    } else {
      storedEmails = this.getStoredEmails();
    }

    if (index > storedEmails.emails.length) {
      return Promise.reject(new Error('Cannot update email by index as index is out of range'));
    }

    storedEmails.emails[index] = email;

    if (_.isNil(passedEmails)) {
      fs.writeFileSync(jsonPath, JSON.stringify({ emails: storedEmails.emails }, null, '\t'));
    }

    return Promise.resolve(storedEmails.emails);
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
      secure: this.secure,
      service: this.service,
    });
  }

  /**
   * Returns a build object ready to be passed into the transporter for sending a email.
   * @param {IEmailContent} content The object containing the message details,
   * from, to, subject, text, html.
   */
  private buildMessage(content: IEmailContent): Promise<IBuiltMessage | Error> {
    if (!_.isObject(content)) {
      return Promise.reject('Build message must be of type string');
    }

    const buildRequirements = ['to', 'subject', 'text', 'html'];

    const message = _.pick(content, buildRequirements);

    if (_.isNil(message.to) || !_.isString(message.to)) {
      return Promise.reject('to must be provided and of type string');
    }

    if (_.isNil(message.subject) || !_.isString(message.subject)) {
      return Promise.reject('subject must be provided and of type string');
    }

    if (_.isNil(message.text) || !_.isString(message.text)) {
      return Promise.reject('text must be provided and of type string');
    }

    if (_.isNil(message.html) || !_.isString(message.html)) {
      return Promise.reject('html must be provided and of type string');
    }

    return Promise.resolve({
      from: this.username,
      html: _.defaultTo(message.html, message.text),
      subject: message.subject,
      text: message.text,
      to: message.to,
    });
  }
}
