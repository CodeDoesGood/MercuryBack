import { Request, Response } from 'express';
import * as _ from 'lodash';
import {  logger } from '../components/Logger';

import Configuration from '../components/Configuration/Configuration';
import constants from '../components/constants';
import Database from '../components/Database';
import Email from '../components/Email';
import * as slack from '../components/Slack';

const config = new Configuration('mercury', 'mercury.json');

function sendHeathCheck(req: Request, res: Response) {
  const webhookUrl: string = config.getKey('slack').mercury;
  const email = new Email(config.getKey('email'));
  const database = new Database(config.getKey('database'));

  let emailStatus: boolean = false;
  let databaseStatus: boolean = false;

  if (_.isNil(webhookUrl)) {
    return res.status(500).send({ error: 'slack hook', description: constants.SLACK_HOOK_MISSING });
  }

  return email.verify()
  .then(() => {
    emailStatus = true;
    return database.connect();
  })
  .then((status: boolean) => {
    databaseStatus = status;
  })
  .finally(() => {
    slack.healthCheck(webhookUrl, emailStatus, databaseStatus)
    .then(() =>  res.status(200).send({ message: 'Health check delivered to slack' }))
    .catch((error: Error) => res.status(500).send({ error: 'Slack', description: constants.SLACK_HEALTH_FAILED(error) }));
  });
}

export {
  sendHeathCheck,
};
