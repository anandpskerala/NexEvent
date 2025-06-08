import mongoose, { Schema } from "mongoose";
import { IOtp } from "../shared/types/otp";

const schema = new Schema<IOtp>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 2 * 60 * 1000),
        expires: 60 * 2
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

const otpModel = mongoose.model<IOtp>("Otp", schema);
export default otpModel;