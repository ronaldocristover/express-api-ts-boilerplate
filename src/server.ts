import { validateEnvironment } from '@/utils/envValidator';

// Validate environment variables before importing anything else
console.log('🔍 Validating environment variables...');
validateEnvironment();
console.log('✅ Environment validation passed');

import App from './app';
import logger from '@/config/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Initialize and start the server
const startServer = async (): Promise<void> => {
  try {
    const app = new App();
    app.listen();
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
