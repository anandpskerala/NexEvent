import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../shared/constants/statusCode";
import { HttpResponse } from "../shared/constants/httpResponse";

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    const roles = req.headers['x-user-roles'];

    if (!roles?.includes("admin")) {
        res.status(StatusCode.UNAUTHORIZED).json({message: HttpResponse.NEED_ADMIN_ACCESS});
        return;
    }

    next();
} 