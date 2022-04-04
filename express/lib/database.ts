import mongoose from 'mongoose';

import { Logger } from './logger';
const logger = Logger.create(module);

const { MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_DATABASE } = process.env;

export async function connect() {
  mongoose.connect(`mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_DATABASE}`);
  mongoose.connection.on('connected', () => logger.info('Connected database'));

  return mongoose;
}
