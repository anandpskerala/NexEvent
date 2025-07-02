import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from 'express-rate-limit';
import { AuthMiddleware } from "./middlewares/authMiddleware";
import { config } from "./config";
import { UserProxy } from "./middlewares/proxies/userProxy";
import { AdminProxy } from "./middlewares/proxies/adminProxy";
import { MessageProxy } from "./middlewares/proxies/messageProxy";
import { EventProxy } from "./middlewares/proxies/eventProxy";
import logger from "./shared/utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";


export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupProxy();
    }

    private setupMiddleware() {
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: config.app.frontend,
            credentials: true
        }));
        this.app.use(requestLogger);

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1000,
            standardHeaders: true,
            legacyHeaders: false,
            message: 'Too many requests, please try again later.',
            handler: (req, res, next, options) => {
                res.status(options.statusCode).json({
                    status: 'error',
                    message: 'Too many requests, please try again later.',
                    retryAfter: Math.ceil(options.windowMs / 1000) + ' seconds'
                });
            }
        });

        this.app.use(limiter);
        const authMiddleware = new AuthMiddleware();
        this.app.use(authMiddleware.authenticate);
        this.app.use(errorHandler);
    }

    private setupProxy() {
        this.app.use('/api/user', UserProxy.setupProxy());
        this.app.use('/api/admin', AdminProxy.setupProxy());
        this.app.use('/api/event', EventProxy.setupProxy());
        this.app.use('/api/messages', MessageProxy.setupProxy());
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            logger.info(`API gateway running on port ${port}`);
        })
    }
}