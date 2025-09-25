import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    app: {
        port: Number(process.env.PORT) || 5003,
        frontendUrl: process.env.FRONTEND_URL || ""
    },
    db: {
        mongoURI: process.env.MONGO_URI || "",
        redis: process.env.REDIS_URI || ""
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUD_API_KEY,
        secret: process.env.CLOUD_SECRET
    },
    services: {
        kafka: process.env.KAFKA_BROKER || "",
        user: process.env.USER_SERVICE || ""
    },
    maxTicketLimit: 3,
    internalToken: process.env.INTERNAL_TOKEN || ""
}