import { createClient } from "redis";
import { config } from ".";

const redisClient = createClient({url: config.db.redisURI});
export const redisSubClient = redisClient.duplicate();

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        await redisSubClient.connect();
        console.log("Redis client connected");
    } catch (error) {
        console.error("Redis connection error: ", error)
    }
}

export default redisClient;