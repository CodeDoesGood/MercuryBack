import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';

import { Configuration } from './configuration';
import { Database } from './database';
import { Email } from './email';
import { logger } from './logger';
import { asyncForEach } from './utils';

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
  id?: number;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  retry_count?: number;
  created_datetime?: string;
  modified_datetime?: string;
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
    return this.knex('stored_email')
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
   * Removes a email by a index from the stored_email table
   * @param index index of the email to remove
   */
  public async removeStoredEmailByIndex(index: number): Promise<number> {
    assert(!_.isNil(index), 'Index cannot be null for removing stored emails');

    return this.knex('stored_email')
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

    return this.knex('stored_email')
      .where('stored_id', index)
      .update({
        stored_html: email.html,
        stored_modified_datetime: new Date(),
        stored_subject: email.subject,
        stored_text: email.text,
        stored_to: email.to,
      });
  }

  /**
   * Write a new email into the database if it fails to send
   * @param email email to be written
   */
  public async newStoredEmail(email: IEmailContent) {
    return this.knex('stored_email').insert({
      stored_created_datetime: new Date(),
      stored_from: this.configuration.email,
      stored_html: email.html,
      stored_modified_datetime: new Date(),
      stored_retry_count: 1,
      stored_subject: email.subject,
      stored_text: email.text,
      stored_to: email.to,
    });
  }

  /**
   * Returns a group of emails based on there id
   * @param idArray A array of stored_email ids
   */
  public async getEmailsFromIds(idArray: number[]): Promise<IEmailContent[]> {
    return this.knex('stored_email')
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
      .whereIn('stored_id', idArray);
  }

  /**
   * Increases all stored emails retry count by one in the array of stored_ids
   * @param idArray an array of email ids
   */
  public async increaseFailedSendTotal(idArray: number[]) {
    return this.knex('stored_email')
      .increment('stored_retry_count', 1)
      .whereIn('stored_id', idArray);
  }

  /**
   * sends all stored late emails and returns a promise array of email ids that failed to be sent
   */
  public async sendStoredEmails(): Promise<IEmailContent[]> {
    const failed: number[] = [];

    const emails = await this.getStoredEmails();

    await asyncForEach(emails, async (email: IEmailContent) => {
      const emailToSend = new Email(email.to, email.subject, email.text, email.html);

      try {
        await this.send(emailToSend);
        await this.removeStoredEmailByIndex(email.id);
      } catch (error) {
        failed.push(email.id);
      }
    });

    await this.increaseFailedSendTotal(failed);
    const failedEmails = await this.getEmailsFromIds(failed);
    return Promise.resolve(failedEmails);
  }

  // Return the online status of the manager
  public getEmailOnline = (): boolean => this.emailOnline;

  // Return the current service provided
  public getService = (): string => this.configuration.service;

  // Returns the current user / who will send it
  public getUsername = (): string => this.configuration.email;

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
