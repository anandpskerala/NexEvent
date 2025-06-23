import { App } from "./app";
import { config } from "./config";
import "./shared/cron/job";

const port = config.app.port;
const server = new App();

server.listen(port);