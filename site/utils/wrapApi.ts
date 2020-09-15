import type { Request, Response } from 'express';
import type { Manager } from '../../server/manager';

export default function wrapApi(
  fn: (req: Request & { dom5Manager: Manager }, res: Response) => unknown,
): (req: Request & { dom5Manager: Manager }, res: Response) => Promise<void> {
  return async (req, res) => {
    try {
      const data = JSON.stringify(await fn(req, res));
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.end(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.statusCode = err.statusCode || 500;
      res.end(JSON.stringify({ message: `${err.name}: ${err.message}` }));
    }
  };
}
