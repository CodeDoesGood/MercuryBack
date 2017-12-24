import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as ratelimit from 'express-rate-limit';

import { logger } from './components/Logger';
import { logErrors } from './middleware/error';
import routes from './routes';

const app = express();
const port = (process.env.PORT === undefined) ? 3000 : process.env.PORT;

const rateLimit = new ratelimit({
  windowMs: 1000,
  max: 10,
  delayMs: 0,
});

app.use(cors());
app.use(rateLimit);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);
app.use(logErrors);

app.listen(port, () => { logger.info(`Server listening on port: ${port}`); });
