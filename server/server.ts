import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/database';
import logger from './utils/logger';
import { startCronJobs } from './services/yieldService';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    logger.info('Database connected successfully');

    startCronJobs();
    logger.info('Cron jobs started');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error as Error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();


