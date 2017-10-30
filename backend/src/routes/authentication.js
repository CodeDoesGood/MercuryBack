const authentication = require('../middleware/authentication');
const database = require('../middleware/database');

const { Router } = require('express').Router;

const router = Router();

router.post('/volunteer/authenticate', [
  authentication.validateAuthenticationDetails.bind(this),
  database.validateUsernameDoesExist.bind(this),
  authentication.authenticateLoggingInUser.bind(this),
]);

router.post('/authenticate/admin', [
  authentication.validateAuthenticationDetails.bind(this),
  database.validateUsernameDoesExist.bind(this),
  authentication.authenticateLoggingInUser.bind(this),
]);

module.exports = router;
