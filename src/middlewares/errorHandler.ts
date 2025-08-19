import { Request, Response, NextFunction } from 'express';
import logger from '@/config/logger';

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export class HttpError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (message: string, statusCode: number = 500): HttpError => {
  return new HttpError(message, statusCode);
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const { statusCode = 500, message } = err;

  logger.error('Error occurred:', {
    error: message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
