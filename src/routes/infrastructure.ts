import { Router } from 'express';
import { infra } from './routing.table';

import * as infrastructure from '../middleware/infrastructure';

const router = Router();

router.get(infra.HELLO, [
  infrastructure.hello.bind(this),
]);

export default router;
