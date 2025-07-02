import dotenv from "dotenv";

dotenv.config();

export const config = {
    app: {
        port: Number(process.env.PORT) || 5000,
        frontend: process.env.FRONTEND_URL || ""
    },
    services: {
        user: process.env.USER_SERVICE || "",
        organizer: process.env.ORGANIZER_SERVICE || "",
        admin: process.env.ADMIN_SERVICE || "",
        event: process.env.EVENT_SERVICE || "",
        payment: process.env.PAYMENT_SERVICE || "",
        message: process.env.MESSAGE_SERVICE || "",
        kafka: process.env.KAFKA_BROKER || 'host.docker.internal:9092'
    },
    jwt: {
        accessToken: process.env.ACCESS_TOKEN_SECRET || ""
    },
}