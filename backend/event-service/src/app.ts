import express, { Application } from "express";
import connectDB from "./config/connectDB";
import routes from "./routes";
import { WalletRepository } from "./repositories/implementation/WalletRepository";
import { KafkaConsumer } from "./kafka/consumers";
import { Handler } from "./kafka/consumers/handlers";
import logger from "./shared/utils/logger";

export class App {
    private app: Application;
    private consumer: KafkaConsumer;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRotes();

        const repo = new WalletRepository();
        const handler = new Handler(repo)
        this.consumer = new KafkaConsumer(handler);
    }

    private setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    private setupRotes() {
        this.app.use("/", routes);
    }

    private async setupKafka() {
        await this.consumer.createTopics();
        await this.consumer.connect();
        await this.consumer.listen();
        process.on("SIGINT", async () => {
            logger.info("SIGINT received, disconnecting consumer...");
            await this.consumer.disconnect();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            logger.info("SIGTERM received, disconnecting consumer...");
            await this.consumer.disconnect();
            process.exit(0);
        });
    }


    public async listen(port: number) {
        connectDB();
        await this.setupKafka();
        this.app.listen(port, () => {
            logger.info(`Event service started on port ${port}`);
        })
    }
}