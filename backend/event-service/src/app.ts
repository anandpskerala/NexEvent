import express, { Application } from "express";
import "reflect-metadata";
import "./containers";
import connectDB from "./config/connectDB";
import routes from "./routes";
import logger from "./shared/utils/logger";

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRotes();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    private setupRotes() {
        this.app.use("/", routes);
    }


    public async listen(port: number) {
        connectDB();
        this.app.listen(port, () => {
            logger.info(`Event service started on port ${port}`);
        })
    }
}