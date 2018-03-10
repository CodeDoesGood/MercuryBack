import { Request, Response } from 'express';
import * as _ from 'lodash';

import { Configuration } from '../configuration';
import constants from '../constants/constants';
import { Database } from '../database';
import { Email } from '../email';
import * as slack from '../slack';

const config = new Configuration('mercury', 'mercury.json');

async function sendHeathCheck(req: Request, res: Response) {
  let webhookUrl: string = config.getKey('slack').mercury;

  if (process.env.NODE_ENV !== 'production') {
    webhookUrl = config.getKey('slack').debug;
  }

  const email = new Email(config.getKey('email'));
  const database = new Database(config.getKey('database'));

  if (_.isNil(webhookUrl)) {
    return res.status(500).send({ error: 'slack hook', description: constants.SLACK_HOOK_MISSING });
  }

  try {
    await email.verify();
    const databaseStatus: boolean = database.getOnlineStatus();
    const emailStatus: boolean = true;

    await slack.healthCheck(webhookUrl, emailStatus, databaseStatus);
    res.status(200).send({ message: 'Health check sent to slack' });
  } catch (error) {
    res.status(500).send({ error: 'Slack', description: constants.SLACK_HEALTH_FAILED(error) });
  }
}

export {
  sendHeathCheck,
};
