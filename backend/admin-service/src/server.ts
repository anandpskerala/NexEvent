import { App } from "./app";
import { config } from "./config";
import "./cron/jobs";

const port = config.app.port;
const server = new App();
server.listen(port);