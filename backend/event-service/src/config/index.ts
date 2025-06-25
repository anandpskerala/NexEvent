import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    app: {
        port: Number(process.env.PORT) || 5003,
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
    services: {
        kafka: process.env.KAFKA_BROKER || "",
        user: process.env.USER_SERVICE || ""
    },
    payment: {
        razorpayID: process.env.RAZORPAY_KEY_ID,
        razorpaySecret: process.env.RAZORPAY_KEY_SECRET,
        stripeSecret: process.env.STRIPE_SECRET_KEY
    }
}