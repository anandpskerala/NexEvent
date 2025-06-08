import mongoose, { Schema } from "mongoose";
import { IRequest } from "../types/organizerRequest";

const schema = new Schema<IRequest>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    organization: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    reason: {
        type: String,
        required: true
    },
    documents: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    rejectionReason: {
        type: String,
        required: false
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

const requestModel = mongoose.model<IRequest>("OrganizerRequest", schema);

export default requestModel;