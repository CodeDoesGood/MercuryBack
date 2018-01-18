import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

import { IToken } from './user';

/**
 * Salts then hashes the password 28000 times
 * @param passedPassword The password being salted and hashed.
 * @param passedSalt can override generate salt for authentication checking
 * @return {{salt, hashedPassword}} A object containing the salt and salted / hashed password
 * to be stored.
 */
export function saltAndHash(passedPassword: string, passedSalt: string = null): {
  salt: string; hashedPassword: string;
} {
  let salt: string = passedSalt;

  if (_.isNil(salt)) {
    salt = crypto.randomBytes(128).toString('base64');
  }

  const hashedPassword: string = crypto.pbkdf2Sync(`${passedPassword}`, salt, 28000, 512, 'sha512').toString('hex');

  return {
    hashedPassword,
    salt,
  };
}

/**
 * Takes in the attempting users password and returns true or false if the details match.
 * @param password The password being used to attempt the login.
 * @returns {boolean}
 */
export function compareAuthenticatingPassword(password: string, salt: string, comparePassword: string): boolean {
  if (_.isNil(password)) {
    return false;
  }
  const hashedPassword = saltAndHash(password, salt);
  return hashedPassword.hashedPassword === comparePassword;
}

// export async function validateAuthenticationToken(token: string, secret: string): Promise<any> {
//   jwt.verify(token, secret, (error: Error, decoded: IToken): Promise<IToken> => {
//     if (!_.isNil(error)) {
//       return Promise.reject(error);
//     }
//     return Promise.resolve(decoded);
//   });
// }

export function signAuthenticationToken(username: string, userId: number, secret: string) {
  return jwt.sign({ username, id: userId }, secret, { expiresIn: '1h' });
}

export async function validateAuthenticationToken(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error: Error, decoded: IToken) => {
      if (!_.isNil(error)) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
}
