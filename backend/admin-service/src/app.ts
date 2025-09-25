import "reflect-metadata";
import "./containers";
import express, { Application } from "express";
import connectDB from "./config/db";
import router from "./routes";
import logger from "./shared/utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { internalAuth } from "./middlewares/internalAuth";



export class App {
    private _app: Application;

    constructor() {
        this._app = express();
        this.setupMiddlewares();
        this.setupRotes();
        this._app.use(errorHandler);
    }

    private setupMiddlewares() {
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(internalAuth)
    }

    private setupRotes() {
        this._app.use("/", router);
    }

    public async listen(port: number) {
        connectDB();
        this._app.listen(port, () => {
            logger.info(`Admin service started on port ${port}`);
        })
    }
}