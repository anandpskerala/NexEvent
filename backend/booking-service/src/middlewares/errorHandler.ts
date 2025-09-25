import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/types/AppError";
import { HttpResponse } from "../shared/constants/httpResponse";
import logger from "../shared/utils/logger";
import { StatusCode } from "../shared/constants/statusCode";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || HttpResponse.INTERNAL_SERVER_ERROR;

    logger.error(err.stack);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}