import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../shared/constants/statusCode";

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    const roles = req.headers['x-user-roles'];

    if (!roles?.includes("organizer")) {
        res.status(StatusCode.UNAUTHORIZED).json({message: "Forbidden: You don't have organizer access"});
        return;
    }

    next();
}