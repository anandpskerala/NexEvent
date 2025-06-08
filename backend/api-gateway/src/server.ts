import { GatewayServer } from "./gatewayServer";
import { config } from "./config";

const port = config.app.port || 3000;
const gateway = new GatewayServer();

gateway.start(port).catch((err) => {
    console.error("Failed to start gateway server:", err);
});