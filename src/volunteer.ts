import * as _ from 'lodash';

import { IAnnouncement, IPasswordResetCode, IVerificationCode, IVolunteerAnnouncement, User } from './user';
import * as utils from './utils';

export class Volunteer extends User {
  constructor(userId?: number, username?: string) {
    super(userId, username);
  }

  public async createVolunteer(password: string): Promise<number> {
    if (_.isNil(this.name) || _.isNil(this.username) || _.isNil(this.email)) {
      return Promise.reject(
        new Error(`name, username, email and password are required, name=${this.name}, username=${this.username}, email=${this.email}`),
      );
    }

    if (_.isNil(password)) {
      return Promise.reject(new Error(`You must provide a password to create the volunteer=${this.username}`));
    }

    const hashedPassword: { salt: string, hashedPassword: string } = utils.saltAndHash(password);
    const date: Date = new Date();

    const volunteer = {
      created_datetime: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      data_entry_user_id: 1,
      email: this.email,
      name: this.name,
      password: hashedPassword.hashedPassword,
      salt: hashedPassword.salt,
      username: this.username,
    };

    return this.knex('volunteer')
      .insert(volunteer)
      .then((id) => {
        const { 0: userId } = id;

        this.password = hashedPassword.hashedPassword;
        this.userId = userId;
        this.salt = hashedPassword.salt;

        const code = this.createVerificationCode();
        return Promise.resolve(code);
      }).catch((error: Error) => Promise.reject(error));
  }

  public async verifyVolunteer(): Promise<boolean> {
    if (_.isNil(this.userId)) {
      return Promise.reject(new Error(`Cannot verify when userId is null or undefined, userId=${this.userId}`));
    }

    return this.knex('volunteer')
      .where('volunteer_id', this.userId)
      .update({ verified: true })
      .then(() => { this.verified = true; return Promise.resolve(true); })
      .catch((error: Error) => Promise.reject(error));
  }

  public async createVerificationCode(): Promise<number> {
    const maxNumber: number = 9999999999999;
    const minNumber: number = 1000000000000;

    const number: number = Math.floor((Math.random() * ((maxNumber - minNumber) + 1000000000000)));
    const hashedNumber: { salt: string; hashedPassword: string; } = utils.saltAndHash(number.toString());
    const date: Date = new Date();

    const verificationCode: IVerificationCode = {
      code: hashedNumber.hashedPassword,
      created_datetime: date,
      salt: hashedNumber.salt,
      verification_code_id: this.userId,
    };

    return this.removeVerificationCode()
      .then(() => this.knex('verification_code').insert(verificationCode))
      .then(() => Promise.resolve(number))
      .catch((error: Error) => Promise.reject(error));
  }

  public async createPasswordResetCode(): Promise<number> {
    const maxNumber: number = 9999999999999;
    const minNumber: number = 1000000000000;

    const number: number = Math.floor((Math.random() * ((maxNumber - minNumber) + 1000000000000)));
    const hashedNumber: { salt: string; hashedPassword: string; } = utils.saltAndHash(number.toString());
    const date: Date = new Date();

    const passwordResetCode: IPasswordResetCode = {
      code: hashedNumber.hashedPassword,
      created_datetime: date,
      password_reset_code_id: this.userId,
      salt: hashedNumber.salt,
    };

    return this.removePasswordResetCode()
      .then(() => this.knex('password_reset_code').insert(passwordResetCode))
      .then(() => Promise.resolve(number))
      .catch((error: Error) => Promise.reject(error));
  }

  public async doesVerificationCodeExist(): Promise<number> {
    if (!_.isNumber(this.userId)) {
      return Promise.reject(new Error(`userId "${this.userId}" passed is not a valid number`));
    }

    return this.knex('verification_code').select('verification_code_id').where('verification_code_id', this.userId).first()
      .then((result: IVerificationCode) => {
        if (_.isNil(result) || _.isNil(result.verification_code_id)) {
          return Promise.reject(new Error(`No verification code exists for user ${this.userId}`));
        }
        return Promise.resolve(result.verification_code_id);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  public async doesPasswordResetCodeExist(): Promise<number> {
    if (!_.isNumber(this.userId)) {
      return Promise.reject(new Error(`userId "${this.userId}" passed is not a valid number`));
    }

    return this.knex('password_reset_code')
      .select('password_reset_code_id')
      .where('password_reset_code_id', this.userId)
      .first()
      .then((result: IPasswordResetCode) => {
        if (_.isNil(result) || _.isNil(result.password_reset_code_id)) {
          return Promise.reject(new Error(`No password reset code exists for user ${this.userId}`));
        }
        return Promise.resolve(result.password_reset_code_id);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  public async updatePassword(password: string): Promise<boolean> {
    if (!_.isNumber(this.userId) || !_.isString(password)) {
      return Promise.reject(new Error('password or id passed was not a valid number or string'));
    }

    const salted = utils.saltAndHash(password);

    return this.knex('volunteer').where('volunteer_id', this.userId).update({
      password: salted.hashedPassword,
      salt: salted.salt,
    })
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  public async getActiveNotifications(): Promise<IAnnouncement[]> {
    return this.knex('volunteer_announcement')
      .where('volunteer_id', this.userId)
      .andWhere('read', false)
      .select('announcement')
      .then((announcementIds: IVolunteerAnnouncement[]) => {
        if (!_.isNil(announcementIds[0])) {
          const justIds = _.map(announcementIds, announcementId => announcementId.announcement);
          return this.knex('announcement').whereIn('announcement_id', justIds).select();
        }
        return Promise.resolve([]);
      })
      .then((announcements: IAnnouncement[]) => Promise.resolve(announcements))
      .catch((error: Error) => Promise.reject(error));
  }

  public async dismissNotification(announcementId: number): Promise<boolean> {
    if (_.isNil(announcementId) || !_.isNumber(announcementId)) {
      return Promise.reject(new Error(`Announcement Id must be passed and also a valid number, announcement id=${announcementId}`));
    }

    if (!_.isNumber(this.userId)) {
      return Promise.reject(new Error(`userId "${this.userId}" passed is not a valid number`));
    }

    return this.knex('volunteer_announcement').where({
      volunteer_announcement_id: announcementId,
      volunteer_id: this.userId,
    }).update({
      read: true,
      read_date: new Date(),
    })
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  public async removePasswordResetCode(): Promise<boolean> {
    if (!_.isNumber(this.userId)) {
      return Promise.reject(new Error(`userId "${this.userId}" passed is not a valid number`));
    }

    return this.knex('password_reset_code').where('password_reset_code_id', this.userId).del()
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  public async removeVerificationCode(): Promise<boolean> {
    if (!_.isNumber(this.userId)) {
      return Promise.reject(new Error(`userId "${this.userId}" passed is not a valid number`));
    }

    return this.knex('verification_code').where('verification_code_id', this.userId).del()
      .then(() => Promise.resolve(true))
      .catch((error: Error) => Promise.reject(error));
  }

  public async getVerificationCode(): Promise<IVerificationCode> {
    if (!_.isNumber(this.userId)) {
      return Promise.reject(new Error(`userId "${this.userId}" passed is not a valid number`));
    }

    return this.knex('verification_code').where('verification_code_id', this.userId).first()
    .then((details: IVerificationCode) => Promise.resolve(details))
    .catch((error: Error) => Promise.reject(error));
  }

  public async getPasswordResetCode(): Promise<IPasswordResetCode> {
    if (!_.isNumber(this.userId)) {
      return Promise.reject(new Error(`userId "${this.userId}" passed is not a valid number`));
    }

    return this.knex('password_reset_code').where('password_reset_code_id', this.userId).first()
    .then((details: IPasswordResetCode) => Promise.resolve(details))
    .catch((error: Error) => Promise.reject(error));
  }
}
