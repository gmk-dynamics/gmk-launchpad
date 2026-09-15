import type { NextFunction, Request, Response } from 'express';
import AppError from '../shared/errors/app.error.js';

const handleError = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
};

const errorMiddleware = {
  handleError,
};

export default errorMiddleware;
