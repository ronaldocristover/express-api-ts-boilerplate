import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createError } from './errorHandler';

export const validateZod = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Merge validated data back to request objects with proper types
      if (validatedData.body) {
        req.body = validatedData.body;
      }
      if (validatedData.query) {
        req.query = validatedData.query;
      }
      if (validatedData.params) {
        req.params = validatedData.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          value:
            err.code === 'invalid_type'
              ? undefined
              : err.path.reduce((obj: any, key) => obj?.[key], req as any),
        }));
        console.log('errorMessages', errorMessages);
        // const validationError = createError('Validation failed', 400);
        // (validationError as any).details = errorMessages;

        return res.status(400).json({
          success: false,
          error: errorMessages,
          message: 'Validation Failed',
        });

        // throw validationError;
      }

      next(error);
    }
  };
};

// Utility function for async validation (if needed)
export const validateZodAsync = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Merge validated data back to request objects
      if (validatedData.body) {
        req.body = validatedData.body;
      }
      if (validatedData.query) {
        req.query = validatedData.query;
      }
      if (validatedData.params) {
        req.params = validatedData.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          value:
            err.code === 'invalid_type'
              ? undefined
              : err.path.reduce((obj: any, key) => obj?.[key], req as any),
        }));

        const validationError = createError('Validation failed', 400);
        (validationError as any).details = errorMessages;

        throw validationError;
      }

      next(error);
    }
  };
};
