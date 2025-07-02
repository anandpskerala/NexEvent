import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { App } from "./app";
import { config } from "./config";
import { Consumer } from "./kafka/consumer";
import { ConsumerHandler } from "./kafka/consumer/handlers/consumerHandler";
import logger from "./shared/utils/logger";

export class GatewayServer {
    private readonly httpServer: HTTPServer;
    private readonly io: SocketIOServer;
    private readonly consumer: Consumer;

    constructor() {
        const appInstance = new App();
        const app = appInstance.app;

        this.httpServer = createServer(app);
        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                origin: config.app.frontend,
                credentials: true,
            },
        })

        const handler = new ConsumerHandler(this.io);
        this.consumer = new Consumer(handler);
    }

    private setupSocketHandlers(): void {
        this.io.on("connection", (socket) => {
            logger.info("Socket.IO: Client connected", socket.id);

            socket.on("join", (userId: string) => {
                socket.join(userId);
                logger.info(`User ${userId} joined their room`);
            });


            socket.on("disconnect", () => {
                logger.info("Socket.IO: Client disconnected", socket.id);
            });
        });
    }

    private async setupKafkaConsumers(): Promise<void> {
        await this.consumer.connect();
        await this.consumer.listen().catch(console.error);
        process.on("SIGINT", async () => {
            logger.info("SIGINT received, disconnecting producer...");
            await this.consumer.disconnect();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            logger.info("SIGTERM received, disconnecting producer...");
            await this.consumer.disconnect();
            process.exit(0);
        });
    }

    public async start(port: number): Promise<void> {
        this.setupSocketHandlers();
        await this.setupKafkaConsumers();

        this.httpServer.listen(port, () => {
            logger.info(`API Gateway service running on port ${port}`);
        });
    }
}
