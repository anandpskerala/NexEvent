import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import { IForgotRequest } from "../types/forgotRequest";

const schema = new Schema<IForgotRequest>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    requestId: {
        type: String,
        required: true,
        default: () => crypto.randomUUID()
    },
    expiry: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 60 * 60 * 1000),
        expires: 60 * 60 
    }
}, { timestamps: true });

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const forgotModel = mongoose.model<IForgotRequest>("ForgotRequest", schema);

export default forgotModel;