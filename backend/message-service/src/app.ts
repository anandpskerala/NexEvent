import "reflect-metadata";
import express, { Application } from "express";
import router from "./routes";
import cors from "cors";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import { NotificationRepository } from "./repositories/implementation/NotificationRepository";
import { Consumer } from "./kafka/consumer";
import { ConsumerHandler } from "./kafka/consumer/handlers/consumerHandler";
import mongoose from "mongoose";
import logger from "./shared/utils/logger";
import { initRedisSubscriber } from "./shared/utils/redisSubscriber";
import "./containers";
import { config } from "./config";

export class App {
	private app: Application;
	private consumer: Consumer;

	constructor() {
		this.app = express();
		this.setupMiddlewares();
		this.setupRoutes();

		const repo = new NotificationRepository();
		const handler = new ConsumerHandler(repo);
		this.consumer = new Consumer(handler);
	}

	private setupMiddlewares() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cors({
			origin: config.app.frontendUrl,
			credentials: true,
		}));
	}

	private setupRoutes() {
		this.app.use("/", router);
	}

	private async setupKafka() {
		await this.consumer.connect();
		await this.consumer.listen();
	}

	private setupShutdownHooks() {
		const shutdown = async (signal: string) => {
			logger.info(`${signal} received. Gracefully shutting down...`);
			try {
				await this.consumer.disconnect();
				await mongoose.disconnect();
			} catch (err) {
				logger.error("Error during shutdown:", err);
			} finally {
				process.exit(0);
			}
		};

		process.on("SIGINT", () => shutdown("SIGINT"));
		process.on("SIGTERM", () => shutdown("SIGTERM"));
	}

	public async listen(port: number) {
		await connectDB();
		await connectRedis();
		await initRedisSubscriber();
		await this.setupKafka();

		this.setupShutdownHooks();

		this.app.listen(port, () => {
			logger.info(`Message service started on port ${port}`);
		});
	}
}
