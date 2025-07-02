import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../shared/constants/statusCode";
import { HttpResponse } from "../shared/constants/httpResponse";

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    const roles = req.headers['x-user-roles'];

    if (!roles?.includes("organizer")) {
        res.status(StatusCode.UNAUTHORIZED).json({message: HttpResponse.NEED_ORGANIZER_ACCESS});
        return;
    }

    next();
}