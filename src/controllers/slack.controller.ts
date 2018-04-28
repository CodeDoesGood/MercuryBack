import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';

import ApiError from '../ApiError';
import { Configuration } from '../configuration';
import constants from '../constants/constants';
import { Database } from '../database';
import { EmailManager } from '../emailManager';
import * as slack from '../slack';

const config = new Configuration();

async function sendHeathCheck(req: Request, res: Response, next: NextFunction) {
  const webhook = slack.getWebhookURL(config);

  if (_.isNil(webhook)) {
    return next(new ApiError(req, res, new Error('unable to gather webhook address'), 500, 'Slack', constants.SLACK_HOOK_MISSING));
  }

  const email = new EmailManager(config.getKey('email'));
  const database = new Database(config.getKey('database'));

  try {
    await email.verify();
    const databaseStatus: boolean = database.getOnlineStatus();
    const emailStatus: boolean = true;

    await slack.healthCheck(webhook, emailStatus, databaseStatus);
    res.status(200).send({ message: 'Health check sent to slack' });
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'Slack', constants.SLACK_HEALTH_FAILED(error)));
  }
}

/**
 * Send a generic slack message
 */
export async function sendSlackMessage(req: Request, res: Response, next: NextFunction) {
  const message = req.body.slack_message;
  const webhook = slack.getWebhookURL(config);

  if (_.isNil(webhook)) {
    return next(new ApiError(req, res, new Error('unable to gather webhook address'), 500, 'Slack', constants.SLACK_HOOK_MISSING));
  }

  if (_.isNil(message)) {
    return next(new ApiError(req, res, new Error('slack_message passed is null'), 400, 'Slack', constants.UNKNOWN_ERROR));
  }

  try {
    await slack.message(webhook, message);
    next();
  } catch (error) {
    next(new ApiError(req, res, error, 500, 'slack', constants.UNKNOWN_ERROR));
  }
}

export { sendHeathCheck };
