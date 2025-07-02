import express, { Application } from "express";
import connectDB from "./config/db";
import router from "./routes";
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
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRotes() {
        this.app.use("/", router);
    }

    public async listen(port: number) {
        connectDB();
        this.app.listen(port, () => {
            logger.info(`Admin service started on port ${port}`);
        })
    }
}