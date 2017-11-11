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
    return new Promise((resolve, reject) => {
      this.transporter.verify((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Returns a build object ready to be passed into the transporter for sending a email.
   * @param {object} content The object containing the message details,
   * from, to, subject, text, html.
   */
  buildMessage(content) {
    if (!_.isObject(content)) {
      throw new Error('Build message must be of type string');
    }

    const buildRequirements = ['to', 'subject', 'text', 'html'];
    const message = _.pick(content, buildRequirements);

    _.forEach(buildRequirements, (item) => {
      if (!message[item] || !_.isString(message[item])) {
        throw new Error(`${item} must be provided and of type string`);
      }
    });

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
   * @param {undefined} html The html to be used instead of the text (defaults to the text)
   */
  send(from, to, subject, text, html = undefined) {
    const content = [{ name: 'from', type: from }, { name: 'subject',  type: subject }, { name: 'text',  type: text }, { name: 'to',  type: to }];

    _.forEach(content, (item) => {
      if (_.isNil(item.type) || !_.isString(item.type)) {
        throw new Error(`${item.name} has to be specified and of type string`);
      }
    });

    return new Promise((resolve, reject) => {
      const message = this.buildMessage({
        from, to, subject, text, html,
      });
      this.transporter.sendMail(message, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
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
