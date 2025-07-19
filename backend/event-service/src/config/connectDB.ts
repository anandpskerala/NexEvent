import mongoose from 'mongoose';
import { config } from '.';
import logger from '../shared/utils/logger';


const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            logger.info("Event Database connected");
        })

        await mongoose.connect(config.db.mongoURI);
    } catch (error) {
        if (error instanceof Error) {
            logger.error("Event MongoDB connection error: ", error.message);
        } else {
            logger.error("Event MongoDB connection error: ", String(error));
        }
    }
}

export default connectDB;