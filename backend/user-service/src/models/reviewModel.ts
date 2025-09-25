import mongoose, { Schema } from "mongoose";
import { IReview } from "../shared/types/IReview";

const schema = new Schema<IReview>({
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true});


const reviewModel = mongoose.model<IReview>("Review", schema);
export default reviewModel;