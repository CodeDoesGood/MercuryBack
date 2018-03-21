import * as fs from 'fs';
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';

import { Configuration } from './configuration';
import { Database } from './database';
import { Email } from './email';
import { logger } from './logger';

const config = new Configuration();

export interface IEmail {
  [index: string]: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

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

export interface IEmailServices {
  user: string;
  secure: boolean;
  service: string;
}

export class EmailManager extends Database {
  private transporter: nodemailer.Transporter;
  private configuration: IEmailOptions;

  private emailOnline: boolean;
  private stored: string;
  /**
   * the email manager to send and process emails
   * @param emailConfiguration Email client configuration
   */
  constructor(emailConfiguration: IEmailOptions) {
    super(config.getKey('database'));

    this.emailOnline = false;
    this.configuration = emailConfiguration;
    this.stored = emailConfiguration.stored;
    this.transporter = this.buildTransporter();
  }

  /**
   * Send a email
   * @param email The email that is going to be sent
   */
  public async send(email: Email): Promise<nodemailer.SentMessageInfo> {
    return email.send(this.transporter, this.configuration.email);
  }

  /**
   * Verify the connection is online
   */
  public async verify() {
    return new Promise((resolve, reject) => {
      this.transporter.verify((error: Error, result: boolean) => {
        if (!_.isNil(error)) {
          Promise.reject(error);
        } else {
          this.emailOnline = true;
          Promise.resolve(result);
        }
      });
    });
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
  }

  /**
   * Replace and update the email service password
   * @param password The new password
   */
  public async updateServicePassword(password: string) {
    this.configuration.password = password;
    this.transporter = this.buildTransporter();
    return this.verify();
  }

  /**
   * returns stored late emails that are stored in the json file.
   */
  public getStoredEmails(): { emails: IEmailContent[] } {
    const jsonPath: string = this.getEmailJSONPath();

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
  public async removeStoredEmailByIndex(index: number, passedEmails = this.getStoredEmails()): Promise<IEmailContent[] | Error> {
    const jsonPath: string = this.getEmailJSONPath();

    if (index > passedEmails.emails.length) {
      return Promise.reject(new Error('Cannot remove email by index as index is out of range'));
    }

    passedEmails.emails.splice(index, 1);
    fs.writeFileSync(jsonPath, JSON.stringify({ emails: passedEmails.emails }, null, '\t'));

    return Promise.resolve(passedEmails.emails);
  }

  /**
   * Replace a email index in the stored json
   * @param index the index of the email to update
   * @param email IEmailContent email to update
   */
  public async replaceStoredEmailByIndex(index: number, email: IEmailContent, passedEmails = this.getStoredEmails()) {
    const jsonPath = this.getEmailJSONPath();

    if (index > passedEmails.emails.length) {
      return Promise.reject(new Error('Cannot update email by index as index is out of range'));
    }

    passedEmails.emails[index] = email;
    fs.writeFileSync(jsonPath, JSON.stringify({ emails: passedEmails.emails }, null, '\t'));
    return Promise.resolve(passedEmails.emails);
  }

  public async sendStoredEmails(jsonPath: string, passedEmails?: IEmailContent[]): Promise<{ emails: IEmailContent[] } | any> {
    if (!this.emailOnline) {
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
      _.forEach(storedEmails.emails, (emailContent: IEmailContent, index: number) => {
        const email = new Email(emailContent.to, emailContent.subject, emailContent.text, emailContent.html);
        this.send(email)
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

  // Return the online status of the manager
  public getEmailOnline = (): boolean => this.emailOnline;

  // Return the current service provided
  public getService = (): string => this.configuration.service;

  // Returns the current user / who will send it
  public getUsername = (): string => this.configuration.email;

  // Get the path to the json file
  public getEmailJSONPath = (): string => this.stored;

  /**
   * Returns the current service configuration that is used to connect and make
   * the email client.
   */
  public getServiceConfig = (): IEmailServices => ({
    secure: true,
    service: this.configuration.service,
    user: this.configuration.email,
  });

  /**
   * Builds the transporter from nodemailer that will be used to send the emails.
   */
  private buildTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      auth: {
        pass: this.configuration.password,
        user: this.configuration.email,
      },
      secure: true,
      service: this.configuration.service,
    });
  }
}
