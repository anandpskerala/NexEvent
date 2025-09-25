import "reflect-metadata";
import "./containers";
import express, { Application } from "express";
import connectDB from "./config/connectDB";
import logger from "./shared/utils/logger";
import routes from "./routes";
import { WalletRepository } from "./repositories/implementation/WalletRepository";
import { Handler } from "./kafka/consumers/handlers";
import { KafkaConsumer } from "./kafka/consumers";
import { errorHandler } from "./middlewares/errorHandler";

export class App {
    private _app: Application;
    private _consumer: KafkaConsumer;

    constructor() {
        this._app = express();
        this.setupMiddlewares();
        this.setupRotes();

        const repo = new WalletRepository();
        const handler = new Handler(repo)
        this._consumer = new KafkaConsumer(handler);
        this._app.use(errorHandler);
    }

    private setupMiddlewares() {
        this._app.use(express.json());
        this._app.use(express.urlencoded({extended: true}));
    }

    private setupRotes() {
        this._app.use("/", routes);
    }

    private async setupKafka() {
        await this._consumer.createTopics();
        await this._consumer.connect();
        await this._consumer.listen();
        process.on("SIGINT", async () => {
            logger.info("SIGINT received, disconnecting consumer...");
            await this._consumer.disconnect();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            logger.info("SIGTERM received, disconnecting consumer...");
            await this._consumer.disconnect();
            process.exit(0);
        });
    }

    public async listen(port: number) {
        connectDB();
        await this.setupKafka();
        this._app.listen(port, () => {
            logger.info(`Booking service started on port ${port}`);
        })
    }
}