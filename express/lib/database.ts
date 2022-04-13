import fs from 'fs';
import path from 'path';
import { EOL } from 'os';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }]
});

const LOG_FILE = path.join(process.cwd(), 'queries.log');

prisma.$on('query', (e) => {
  const log = `QUERY: ${e.query} ${EOL}PARAMS: ${e.params} ${EOL}DURATION: ${e.duration}ms${EOL}`;

  fs.appendFileSync(LOG_FILE, log);
});

export default prisma;
