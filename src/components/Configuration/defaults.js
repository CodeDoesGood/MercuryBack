const defaultConfig = {
  // Email details
  email: {
    service: 'gmail',
    email: 'noreply@codedoesgood.org',
    password: null,
  },

  // Secret used to authenticate tokens, this should be updated on the server to the real secret.
  secret: 'secret',
  // The path to the doddle database
  databasePath: './src/database/database.db',
};

module.exports = defaultConfig;
