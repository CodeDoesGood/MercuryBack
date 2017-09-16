const defaultConfig = {
  // Email details
  email: {
    service: 'gmail',
    email: 'contact@codedoesgood.org',
    password: null,
  },

  database: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'mercury',
    },
  },

  // Secret used to authenticate tokens, this should be updated on the server to the real secret.
  secret: null,
};

module.exports = defaultConfig;
