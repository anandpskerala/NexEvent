import mongoose from 'mongoose';
import { config } from '../config'
import logger from '../shared/utils/logger';


const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            logger.info("User Database connected");
        })

        await mongoose.connect(config.db.mongoURI);
    } catch (error) {
        if (error instanceof Error) {
            logger.error("User MongoDB connection error: ", error.message);
        } else {
            logger.error("User MongoDB connection error: ", String(error));
        }
    }
}

export default connectDB;