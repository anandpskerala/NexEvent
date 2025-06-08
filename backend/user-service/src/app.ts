import express, { Application } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import routes from "./routes";

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
        this.app.use(cookieParser());
    }

    private setupRoutes() {
        this.app.use("/", routes);
    }

    public async listen(port: number) {
        await connectDB();
        this.app.listen(port, () => {
            console.log(`User service started on port ${port}`);
        })
    }
}