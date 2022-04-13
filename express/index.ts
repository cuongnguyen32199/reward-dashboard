import next from 'next';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';

import { Logger } from './lib/logger';

import rewards from './api/reward';

const PORT = 3000;
const logger = Logger.create(module);

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(express.json({ limit: '25MB' }));
  server.use(express.urlencoded({ extended: true }));

  server.use('/api/rewards', rewards);

  server.all('*', (req: Request, res: Response) => handle(req, res));

  server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
});
