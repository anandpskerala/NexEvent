import mongoose, { Schema } from "mongoose";
import { IRequest } from "../shared/types/IRequest";

const schema = new Schema<IRequest>({
    userId: {
        type: String,
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


const requestModel = mongoose.model<IRequest>("OrganizerRequest", schema);

export default requestModel;