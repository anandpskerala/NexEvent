import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";


export class AuthMiddleware {
    private publicPaths: string[] = [
        "/api/user/auth/login",
        "/api/user/auth/register",
        "/api/user/auth/google",
        "/api/user/auth/logout",
        "/api/user/auth/forgot-password",
        "/api/user/auth/reset-password",
        "/api/user/auth/token/refresh"
    ];

    private isPublicRoute(path: string) {
        return this.publicPaths.some((route) => {
            const regex = new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$');
            return regex.test(path);
        });
    }

    public authenticate = (req: Request, res: Response, next: NextFunction): void => {
        if (this.isPublicRoute(req.path)) return next();

        const token = req.cookies?.accessToken 

        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        try {
            const decoded = jwt.verify(token, config.jwt.accessToken) as {userId: string, role: string[]};
            req.headers['x-user-id'] = decoded.userId;
            req.headers['x-user-roles'] = decoded.role;
            next();
        } catch (err) {
            console.log(err)
            res.status(403).json({ message: 'Invalid or expired token' });
            return;
        }
    };
}