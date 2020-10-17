import type { Request, Response } from 'express';
import type { Manager } from '../../server/manager';

export default function wrapApi<T>(
  fn: (
    req: Request & { dom5Manager: Manager },
    res: Response,
  ) => T | Promise<T>,
): (
  req: Request & { dom5Manager: Manager },
  res: Response,
  // Doesn't actually ever return the type T, but we want to be able to extract the type later
) => Promise<T | void> {
  return async (req, res) => {
    try {
      const fnData = await fn(req, res);
      const data = JSON.stringify(fnData);
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
