import express, { Application } from "express";
import routes from "./routes";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRoutes() {
        this.app.use("/", routes);
    }

    public async listen(port: number) {
        await connectDB();
        await connectRedis();
        this.app.listen(port, () => {    
            console.log(`Message service started on port ${port}`);
        })
    }
}