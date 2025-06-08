import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    app: {
        port: Number(process.env.PORT) || 5001,
        frontendUrl: process.env.FRONTEND_URL || ""
    },
    db: {
        mongoURI: process.env.MONGO_URI || ""
    },
    jwt: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || ""
    },
    mail: {
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUD_API_KEY,
        secret: process.env.CLOUD_SECRET
    },
    service: {
        kafka: process.env.KAFKA_BROKER || 'host.docker.internal:9092'
    }
}