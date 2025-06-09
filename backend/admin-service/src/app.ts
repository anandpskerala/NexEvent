import express, { Application } from "express";
import connectDB from "./config/db";
import routes from "./routes";


export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRotes();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    private setupRotes() {
        this.app.use("/", routes);
    }

    public async listen(port: number) {
        connectDB();
        this.app.listen(port, () => {
            console.log(`Admin service started on port ${port}`);
        })
    }
}