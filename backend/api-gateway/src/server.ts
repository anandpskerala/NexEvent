import { GatewayServer } from "./gatewayServer";
import { config } from "./config";
import logger from "./shared/utils/logger";
import { ServiceResolver } from "./resolvers/implementation/ServiceResolver";

const port = config.app.port || 3000;
const services = new ServiceResolver({
    admin: config.services.admin,
    bookings: config.services.booking,
    event: config.services.event,
    messages: config.services.message,
    user: config.services.user 
})
const gateway = new GatewayServer(services);

gateway.start(port).catch((err) => {
    logger.error("Failed to start gateway server:", err);
});