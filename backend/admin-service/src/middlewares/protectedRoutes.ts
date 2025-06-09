import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../shared/constants/statusCode";

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    const roles = req.headers['x-user-roles'];

    if (!roles?.includes("admin")) {
        res.status(StatusCode.UNAUTHORIZED).json({message: "Forbiden: You don't have admin access"});
        return;
    }

    next();
} 