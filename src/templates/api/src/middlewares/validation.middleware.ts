import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import AppError from '../shared/errors/app.error.js';

const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(new AppError('Validation failed.', 400, result.error.issues));

      return;
    }

    const data = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    req.validatedbody = data.body;
    req.validatedparams = data.params;
    req.validatedquery = data.query;

    next();
  };

const validationMiddleware = {
  validate,
};

export default validationMiddleware;
