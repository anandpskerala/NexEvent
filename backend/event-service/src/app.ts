import express, { Application } from "express";
import "reflect-metadata";
import "./containers";
import connectDB from "./config/connectDB";
import routes from "./routes";
import logger from "./shared/utils/logger";
import { errorHandler } from "./middlewares/errorHandler";

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
        this._app.use(express.urlencoded({extended: true}));
    }

    private setupRotes() {
        this._app.use("/", routes);
    }


    public async listen(port: number) {
        connectDB();
        this._app.listen(port, () => {
            logger.info(`Event service started on port ${port}`);
        })
    }
}