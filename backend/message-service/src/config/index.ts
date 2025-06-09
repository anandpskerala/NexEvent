import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    app: {
        port: Number(process.env.PORT) || 5004,
        frontendUrl: process.env.FRONTEND_URL || ""
    },
    db: {
        mongoURI: process.env.MONGO_URI || ""
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUD_API_KEY,
        secret: process.env.CLOUD_SECRET
    },
    service: {
        kafka: process.env.KAFKA_BROKER || 'host.docker.internal:9092',
        user: process.env.USER_SERVICE || ""
    }
}