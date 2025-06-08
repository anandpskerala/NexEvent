import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../shared/constants/statusCode";


export const adminRoute =  async (req: Request, res: Response, next: NextFunction) => {
    const roles = req.headers['x-user-roles'];

    if (!roles?.includes("admin")) {
        res.status(StatusCode.UNAUTHORIZED).json({message: "Unauthorized: You don't have enough rights"});
        return;
    }

    next();
}