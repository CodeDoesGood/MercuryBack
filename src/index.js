const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./components/Logger/Logger');
const error = require('./middleware/error');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);
app.use(error.logErrors);

app.listen(port, () => { logger.info(`Server listening on port: ${port}`); });
