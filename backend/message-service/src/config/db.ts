import mongoose from 'mongoose';
import { config } from '.';


const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Message Database connected");
        })

        await mongoose.connect(config.db.mongoURI);
    } catch (error) {
        console.error("MongoDB connection error: ", error)
    }
}

export default connectDB;