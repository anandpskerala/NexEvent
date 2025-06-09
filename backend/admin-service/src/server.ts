import { App } from "./app";
import { config } from "./config";

const port = config.app.port;
const server = new App();
server.listen(port);