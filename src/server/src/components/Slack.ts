import { IncomingWebhook } from '@slack/client';

import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as os from 'os';

/**
 * Send a message to slack via a slack webhook.
 * @param url slack webhook address
 * @param slackMessage The message to send to slack
 */
export function message(url: string, slackMessage: string | {}): Promise<boolean | Error> {
  return new Promise((resolve, reject) => {
    const webhook = new IncomingWebhook(url);

    webhook.send(slackMessage, (err: Error, res: boolean) => {
      if (err !== null && err !== undefined) {
        reject(err);
      }
      resolve(res);
    });

  });
}

/**
 * Sends out a red warning twich message to the provided webhook url
 * @param url the url for the webhook
 */
export function serviceDownMessage(url: string, service: string): Promise<boolean | Error> {
  const serviceMessage = {
    text: 'Service Update',

    attachments: [{
      color: '#FF0032',
      fallback: 'Offline services',
      fields: [{
        short: false,
        title: `${service} is currently down`,
        value: `As of ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} the serice ${service} is down`,
      }],
    }],
  };

  return message(url, serviceMessage);

}

/**
 * Generates a simple health check for the system and sends it to slack.
 * @param url slack webhook address
 * @param email online boolean
 * @param database online boolean
 */
export function healthCheck(url, email: boolean, database: boolean): Promise<boolean | Error> {
  const online = [];
  const offline = [];

  (email) ? online.push('Email') : offline.push('Email');
  (database) ? online.push('Database') : offline.push('Database');

  const healthMessage = {
    text: 'Health Check',

    attachments: [{
      color: '#FF0032',
      fallback: 'Offline services',
      fields: [],
    }, {
      color: 'good',
      fallback: 'Online services',
      fields: [{
        short: true,
        title: 'Slack',
        value: 'Online',
      }],
    }],
  };

  _.forEach(offline, (name) => {
    healthMessage.attachments[0].fields.push({
      short: true,
      title: name,
      value: 'Offline',
    });
  });

  _.forEach(online, (name) => {
    healthMessage.attachments[1].fields.push({
      short: true,
      title: name,
      value: 'Online',
    });
  });

  healthMessage.attachments.push({
    color: '#0000FF',
    fallback: 'Extra information',
    fields: [{
      short: true,
      title: 'Architecture',
      value: os.arch(),
    },
    {
      short: true,
      title: 'CPU Usage',
      value: `${cpuAverage()}%`,
    },
    {
      short: true,
      title: 'Memory',
      value: `${formatBytes(os.totalmem)}`,
    },
    {
      short: true,
      title: 'Memory Usage',
      value: `${formatBytes(os.freemem())}`,
    },
    {
      short: true,
      title: 'Uptime',
      value: `${(Math.floor(os.uptime()) / 60).toFixed(2)} min`,
    }],
  });

  return message(url, healthMessage);
}

/**
 * Returns a string formatted system memory
 * @param bytes number of system memory in bytes
 */
function formatBytes(bytes): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k: number = 1024;
  const dm: number = 2;
  const memSizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + memSizes[i];
}

/**
 * returns a object with average idle and average cpu usage
 * @param cpus os.cpus()
 */
function cpuAverage(): string {
  if (os.platform() === 'win32') {
    return 'Windows not supported';
  }

  const averageLoad: number[] = os.loadavg();
  let average: number = 0;

  _.forEach(averageLoad, (cpu: number) => {
    average += cpu;
  });

  return average.toFixed(2);
}
