const authentication = require('../middleware/authentication');
const database = require('../middleware/database');

const { auth } = require('./routing.table');
const { Router } = require('express');

const router = Router();

router.post(auth.VOLUNTEER, [
  authentication.validateAuthenticationDetails.bind(this),
  database.validateUsernameDoesExist.bind(this),
  authentication.authenticateLoggingInUser.bind(this),
]);

router.post(auth.ADMIN, [
  authentication.validateAuthenticationDetails.bind(this),
  database.validateUsernameDoesExist.bind(this),
  authentication.authenticateLoggingInUser.bind(this),
]);

module.exports = router;
