require('dotenv').config();

import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import logger from './configs/logger.config';
import app from './configs/express.config';

const PORT: string = process.env.PORT;

const connect: () => Promise<void> = async () => {
  try {
    const connection: Connection = await createConnection(); // Connect to the DB that is setup in the ormconfig.js
    await connection.runMigrations(); // Run all migrations
    logger.info('Connect to database successfully');
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (e: any) {
    logger.info(`The connection to database was failed with error: ${e}`);
  }
}

connect();
