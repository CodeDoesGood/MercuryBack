import { Request, Response } from 'express';

function hello(req: Request, res: Response) {
  res.status(200).send({ message: 'hello' });
}

function unavailable(req: Request, res: Response) {
  res.status(500).send({ error: 'Unavailable Service', description: 'Unavailable Service' });
}

export {
  hello,
  unavailable,
};
