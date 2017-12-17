const { router } = require('express');

const infrastructure = require('../middleware/infrastructure');

router.get('/infrastructure/hello', [
  infrastructure.hello.bind(this),
]);

module.exports = router;
