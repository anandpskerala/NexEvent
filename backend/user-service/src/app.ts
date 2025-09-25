import "reflect-metadata";
import "./containers";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import routes from "./routes";
import logger from "./shared/utils/logger";
import { errorHandler } from "./middlewares/errorHandler";

export class App {
    private _app: Application;
    constructor() {
        this._app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this._app.use(errorHandler);
    }

    private setupMiddlewares() {
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(cookieParser());
    }

    private setupRoutes() {
        this._app.use("/", routes);
    }

    public async listen(port: number) {
        await connectDB();
        this._app.listen(port, () => {
            logger.info(`User service started on port ${port}`);
        })
    }
}