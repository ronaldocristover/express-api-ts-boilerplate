import { Request, Response, NextFunction } from 'express';
import logger from '@/config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  const originalSend = res.send;
  res.send = function (body) {
    res.send = originalSend;
    const duration = Date.now() - start;

    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentLength: res.get('Content-Length'),
    });

    return originalSend.call(this, body);
  };

  next();
};
