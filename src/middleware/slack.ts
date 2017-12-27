import { Request, Response } from 'express';

function sendHeathCheck(req: Request, res: Response) {
  res.status(400).send({ message: 'Currently Unavailable' });
}

export {
  sendHeathCheck,
};
