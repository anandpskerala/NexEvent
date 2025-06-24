import mongoose, { Schema } from "mongoose";
import { IReview } from "../shared/types/IReview";

const schema = new Schema<IReview>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
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

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});


const reviewModel = mongoose.model<IReview>("Review", schema);
export default reviewModel;