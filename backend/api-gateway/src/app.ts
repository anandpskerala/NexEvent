import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AuthMiddleware } from "./middlewares/authMiddleware";
import { config } from "./config";
import { UserProxy } from "./middlewares/proxies/userProxy";


export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupProxy();
    }

    private setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true}));
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: config.app.frontend,
            credentials: true
        }));
        const authMiddleware = new AuthMiddleware();
        this.app.use(authMiddleware.authenticate)
    }

    private setupProxy() {
        this.app.use('/api/user', UserProxy.setupProxy());
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            console.log(`API gateway running on port ${port}`);
        })
    }
}