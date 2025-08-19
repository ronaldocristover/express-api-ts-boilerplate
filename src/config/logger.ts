import winston from 'winston';
import environment from './environment';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: environment.NODE_ENV === 'production' ? 'error' : 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    environment.NODE_ENV === 'development' ? combine(colorize(), customFormat) : json()
  ),
  defaultMeta: { service: 'boiler-express' },
  transports: [
    new winston.transports.File({
      filename: environment.LOG_FILE_PATH,
      level: 'error',
    }),
    new winston.transports.File({
      filename: environment.LOG_FILE_PATH.replace('.log', '-combined.log'),
    }),
  ],
});

if (environment.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), customFormat),
    })
  );
}

export default logger;
