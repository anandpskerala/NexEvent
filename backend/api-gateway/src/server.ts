import { GatewayServer } from "./gatewayServer";
import { config } from "./config";
import logger from "./shared/utils/logger";

const port = config.app.port || 3000;
const gateway = new GatewayServer();

gateway.start(port).catch((err) => {
    logger.error("Failed to start gateway server:", err);
});