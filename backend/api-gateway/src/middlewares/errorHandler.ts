import { Request, Response, NextFunction } from 'express';
import logger from '../shared/utils/logger';
import { HttpResponse } from '../shared/constants/httpResponse';

interface CustomError extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: CustomError, req: Request, res: Response, _: NextFunction) => {
  logger.error({ err }, 'Unhandled Error');

  res.status(err?.status || 500).json({
    message: err.message || HttpResponse.INTERNAL_SERVER_ERROR,
  });
};