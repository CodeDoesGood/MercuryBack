const bodyParser = require('body-parser');
const express = require('express');

const error = require('./middleware/error');
const logger = require('./components/Logger');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);
app.use(error.logErrors);

app.listen(port, () => { logger.info(`Server listening on port: ${port}`); });
