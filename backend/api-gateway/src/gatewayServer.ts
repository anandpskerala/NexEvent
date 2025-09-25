import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { App } from "./app";
import { config } from "./config";
import { Consumer } from "./kafka/consumer";
import { ConsumerHandler } from "./kafka/consumer/handlers/consumerHandler";
import logger from "./shared/utils/logger";
import { IServiceResolver } from "./resolvers/interfaces/IServiceResolver";

export class GatewayServer {
    private readonly _httpServer: HTTPServer;
    private readonly _io: SocketIOServer;
    private readonly _consumer: Consumer;

    constructor(
        private _services: IServiceResolver
    ) {
        const appInstance = new App(this._services);
        const app = appInstance._app;

        this._httpServer = createServer(app);
        this._io = new SocketIOServer(this._httpServer, {
            cors: {
                origin: config.app.frontend,
                credentials: true,
            },
        })

        const handler = new ConsumerHandler(this._io);
        this._consumer = new Consumer(handler);
    }

    private setupSocketHandlers(): void {
        this._io.on("connection", (socket) => {
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
        await this._consumer.connect();
        await this._consumer.listen().catch(console.error);
        process.on("SIGINT", async () => {
            logger.info("SIGINT received, disconnecting producer...");
            await this._consumer.disconnect();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            logger.info("SIGTERM received, disconnecting producer...");
            await this._consumer.disconnect();
            process.exit(0);
        });
    }

    public async start(port: number): Promise<void> {
        this.setupSocketHandlers();
        await this.setupKafkaConsumers();

        this._httpServer.listen(port, () => {
            logger.info(`API Gateway service running on port ${port}`);
        });
    }
}
