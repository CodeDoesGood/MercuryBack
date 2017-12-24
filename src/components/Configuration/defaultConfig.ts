import { IDatabaseConfig } from '../Database';

export interface IConfig {
  [index: string]: any;

  online_address: string;
  online: boolean;
  email: {
    service: string;
    email: string;
    password: string;
  };

  database: IDatabaseConfig;

  secret: string;
}

export const defaultConfig: IConfig = {
  online: false,
  online_address: 'http://138.197.167.204:8080',

  email: {
    email: 'contact@codedoesgood.org',
    password: null,
    service: 'gmail',
  },

  database: {
    client: 'mysql',
    connection: {
      database: 'mercury',
      host: '127.0.0.1',
      password: '',
      user: 'root',
    },
    pool: { min: 0, max: 100 },
  },

  // Secret used to authenticate tokens, this should be updated on the server to the real secret.
  secret: null,
};
