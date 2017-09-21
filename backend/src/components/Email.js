const _ = require('lodash');
const nodemailer = require('nodemailer');
const Promise = require('bluebird');

const logger = require('./Logger');

class Email {
  constructor(options) {
    // The type of service used for emailing.
    this.service = options.service;

    // The email that will be used to make the connection.
    this.username = options.email;

    // Transporter that will be sending the emails
    this.transporter = this.build(options.password);

    // Status for checking that the email connection is working.
    this.online = false;

    this.verify()
      .then(() => {
        logger.info(`Email Client is ready, service=${this.service}, email=${this.username}`);
        this.online = true;
      })
      .catch(error => logger.error(`Error creating email connection, error=${error}`));
  }

  /**
   * Builds the transporter from nodemailer that will be used to send the emails.
   * @param {string} pass The password that is being used to authenticate with the service.
   */
  build(pass) {
    return nodemailer.createTransport({
      secure: true,
      service: this.service,
      auth: {
        user: this.username,
        pass,
      },
    });
  }

  /**
   * Verifies the connection the service.
   */
  verify() {
    this.transporter.verify((error, result) => {
      if (error) {
        return Promise.reject(error);
      }
      return Promise.resolve(result);
    });
  }

  /**
   * Returns a build object ready to be passed into the transporter for sending a email.
   * @param {object} message The object containing the message details,
   * from, to, subject, text, html.
   */
  buildMessage(message) {
    return {
      from: this.username,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: _.defaultTo(message.html, message.text),
    };
  }

  /**
   * Sends a email to the provided person with the provided content.
   * @param {string} to The person who is getting sent the email.
   * @param {string} subject The subject text for the email.
   * @param {string} text  The content text for the email.
   * @param {string} html The html to be used instead of the text (defaults to the text)
   */
  send(from, to, subject, text, html = null) {
    const message = this.buildMessage({ from, to, subject, text, html });
    this.transporter.sendMail(message, (error, info) => {
      if (error) {
        return Promise.reject(error);
      }
      return Promise.resolve(info);
    });
  }

  /**
   * Returns the online status of the email service (true, false).
   */
  getStatus() {
    return this.online;
  }
}

module.exports = Email;
