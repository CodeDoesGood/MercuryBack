import { Router } from 'express';
import { infra } from './routing.route';

import * as infrastructure from '../controllers/infrastructure.controller';

const router = Router();

router.get(infra.HELLO, [
  infrastructure.hello.bind(this),
]);

export default router;
