const { infra } = require('./routing.table');
const { Router } = require('express');

const infrastructure = require('../middleware/infrastructure');

const router = Router();

router.get(infra.HELLO, [
  infrastructure.hello.bind(this),
]);

module.exports = router;
