import * as assert from 'assert';
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
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
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
          reject(error);
        } else {
          this.emailOnline = true;
          resolve(result);
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
   * Get stored emails from the stored late emails table in the database
   */
  public async getStoredEmails(): Promise<IEmailContent[]> {
    return this.knex('stored_emails')
      .select(
        'stored_id as id',
        'stored_to as to',
        'stored_from as from',
        'stored_subject as subject',
        'stored_text as text',
        'stored_html as html',
        'stored_retry_count as retry_count',
        'stored_created_datetime as created_datetime',
        'stored_modified_datetime as modified_datetime',
      )
      .then((emails: IEmailContent[]) => Promise.resolve(emails))
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Removes a email by a index from the stored_emails table
   * @param index index of the email to remove
   */
  public async removeStoredEmailByIndex(index: number): Promise<number> {
    assert(!_.isNil(index), 'Index cannot be null for removing stored emails');

    return this.knex('stored_emails')
      .where('stored_id', index)
      .del();
  }

  /**
   * Updates content within the database of selected content
   * @param index the id to update
   * @param email The email content that will be updated
   */
  public async updateStoredEmailByIndex(index: number, email: IEmailContent): Promise<number> {
    assert(!_.isNil(index), 'Index cannot be null for updating stored emails');

    // filter out everything apart from what we are updating
    const updated = _.pick(email, ['to', 'subject', 'from', 'text', 'html']);

    return this.knex('stored_emails')
      .where('stored_id', index)
      .update({
        stored_html: email.html,
        stored_modified_datetime: new Date(),
        stored_subject: email.subject,
        stored_text: email.text,
        stored_to: email.to,
      });
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
            updatedStoredEmails.emails = updatedStoredEmails.emails.slice(index, 1);
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

  // Sets the online status of the email service
  public setEmailOnline = (online: boolean) => (this.emailOnline = online);

  /**
   * Returns the current service configuration that is used to connect and make
   * the email client.
   */
  public getServiceConfig(): IEmailServices {
    return {
      secure: true,
      service: this.configuration.service,
      user: this.configuration.email,
    };
  }

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
