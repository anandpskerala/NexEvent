import { Request, Response, NextFunction } from 'express';
import logger from '../shared/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const logMessage = `[${req.method}] ${req.originalUrl} ${timestamp} ${res.statusCode} ${duration}ms`;
    logger.info(logMessage);
  });

  next();
};
