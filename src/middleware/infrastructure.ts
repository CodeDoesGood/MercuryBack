import { Request, Response } from 'express';

function hello(req: Request, res: Response) {
  res.status(200).send({ message: 'hello' });
}

function unused(req: Request, res: Response) {
  res.status(500);
}

export {
  hello,
  unused,
};
