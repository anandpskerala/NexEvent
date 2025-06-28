import { createClient } from "redis";
import { config } from ".";
import logger from "../shared/utils/logger";

const redisClient = createClient({url: config.db.redisURI});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        logger.info("Redis client connected");
    } catch (error) {
        logger.error("Redis connection error: ", error)
    }
}

export default redisClient;