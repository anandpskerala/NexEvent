import mongoose from 'mongoose';
import { config } from '.';
import logger from '../shared/utils/logger';


const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            logger.info("Message Database connected");
        })

        await mongoose.connect(config.db.mongoURI);
    } catch (error) {
        logger.error("MongoDB connection error: ", error)
    }
}

export default connectDB;