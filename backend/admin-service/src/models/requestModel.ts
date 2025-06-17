import mongoose, { Schema } from "mongoose";
import { IRequests } from "../shared/types/IRequests";

const schema = new Schema<IRequests>({
    userId: {
        type: String,
        required: true
    },
    featureTitle: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    useCase: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
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


const requestModel = mongoose.model<IRequests>("Requests", schema);

export default requestModel;
