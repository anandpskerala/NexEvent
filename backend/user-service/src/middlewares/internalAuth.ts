import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { StatusCode } from "../shared/constants/statusCode";


export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-internal-token"];
    if (token !== config.internalToken) {
        res.status(StatusCode.FORBIDDEN).json({ message: "Forbidden: Direct access not allowed" });
        return;
    }
    next();
}