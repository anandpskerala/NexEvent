import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    app: {
        port: Number(process.env.PORT) || 5002,
        frontendUrl: process.env.FRONTEND_URL || ""
    },
    db: {
        mongoURI: process.env.MONGO_URI || ""
    },
    services: {
        user: process.env.USER_SERVICE || ""
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUD_API_KEY,
        secret: process.env.CLOUD_SECRET
    },
}