// We really need base to be run first thing
/* eslint-disable import/order */
import start from './base';
import express from 'express';
import manager, { Manager } from './manager';

const port = parseInt(process.env.PORT as string, 10) || 3000;

start((app) => {
  const server = express();
  const nextHandler = app.getRequestHandler();

  server.use((req, res, next) => {
    (req as typeof req & { dom5Manager: Manager }).dom5Manager = manager;
    return next();
  });

  server.use((req, res) => {
    nextHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
