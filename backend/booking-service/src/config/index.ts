import dotenv from "dotenv";

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    app: {
        port: Number(process.env.PORT) || 5005,
        frontendUrl: process.env.FRONTEND_URL || ""
    },
    services: {
        kafka: process.env.KAFKA_BROKER || "",
        user: process.env.USER_SERVICE || "",
        event: process.env.EVENT_SERVICE || "",
    },
    db: {
        mongoURI: process.env.MONGO_URI || ""
    },
    payment: {
        razorpayID: process.env.RAZORPAY_KEY_ID,
        razorpaySecret: process.env.RAZORPAY_KEY_SECRET,
        stripeSecret: process.env.STRIPE_SECRET_KEY
    },
    maxTicketLimit: 10,
    internalToken: process.env.INTERNAL_TOKEN || ""
};