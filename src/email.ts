import * as assert from 'assert';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';

import { logger } from './logger';

export interface IBuiltMessage {
  from: string;
  html: string;
  subject: string;
  text: string;
  to: string;
}

export class Email {
  public to: string;
  public subject: string;
  public text: string;
  public html?: string;

  /**
   * Creation of a new email
   * @param to whot he email is being setnt o
   * @param subject the email subject
   * @param text the email body
   * @param html the html body
   */
  constructor(to: string, subject: string, text: string, html?: string) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;

    this.validateEmailContent();
  }

  /**
   * Send the email
   * @param transporter The email transporter used ot send the email
   */
  public async send(transporter: nodemailer.Transporter, from: string): Promise<Error | nodemailer.SentMessageInfo> {
    return new Promise((resolve, reject) => {
      transporter.sendMail(this.built(from), (error: Error, info: nodemailer.SentMessageInfo) => {
        if (!_.isNil(error)) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  /**
   * Validates that all passed emails are all strings
   */
  private validateEmailContent() {
    assert.equal(_.isString(this.to), true, 'Email to must be a string');
    assert.equal(_.isString(this.subject), true, 'Email subject must be a string');
    assert.equal(_.isString(this.text), true, 'Email text must be a string');
    assert.equal(_.isString(this.html), true, 'Email html must be a string');
  }

  /**
   * returns a read to send email built
   * @param from the email the email would be sent from
   */
  private built(from: string): IBuiltMessage {
    const message: IBuiltMessage = {
      from,
      html: this.html,
      subject: this.subject,
      text: this.text,
      to: this.to,
    };

    return message;
  }
}
