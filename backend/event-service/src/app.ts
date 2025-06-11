import express, { Application } from "express";
import connectDB from "./config/connectDB";
import routes from "./routes";
import { WalletRepository } from "./repositories/WalletRepository";
import { KafkaConsumer } from "./kafka/consumers";
import { Handler } from "./kafka/consumers/handlers";

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
            console.log("SIGINT received, disconnecting consumer...");
            await this.consumer.disconnect();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            console.log("SIGTERM received, disconnecting consumer...");
            await this.consumer.disconnect();
            process.exit(0);
        });
    }


    public async listen(port: number) {
        connectDB();
        await this.setupKafka();
        this.app.listen(port, () => {
            console.log(`Event service started on port ${port}`);
        })
    }
}