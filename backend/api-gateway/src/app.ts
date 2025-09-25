import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from 'express-rate-limit';
import { AuthMiddleware } from "./middlewares/authMiddleware";
import { config } from "./config";
import logger from "./shared/utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { IServiceResolver } from "./resolvers/interfaces/IServiceResolver";


export class App {
    public _app: Application;

    constructor(
        private _service: IServiceResolver
    ) {
        this._app = express();
        this.setupMiddleware();
        this.setupProxy();
    }

    private setupMiddleware() {
        this._app.use(helmet());
        this._app.use(compression());
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(cookieParser());
        this._app.use(cors({
            origin: config.app.frontend,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        this._app.use(requestLogger);

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

        this._app.use(limiter);
        const authMiddleware = new AuthMiddleware();
        this._app.use(authMiddleware.authenticate);
        this._app.use(errorHandler);
    }

    private setupProxy() {
        this._app.use('/api/user', this._service.resolve("user"));
        this._app.use('/api/admin', this._service.resolve("admin"));
        this._app.use('/api/event', this._service.resolve("event"));
        this._app.use('/api/messages', this._service.resolve("messages"));
        this._app.use('/api/bookings', this._service.resolve("bookings"));
    }

    public listen(port: number) {
        this._app.listen(port, () => {
            logger.info(`API gateway running on port ${port}`);
        })
    }
}