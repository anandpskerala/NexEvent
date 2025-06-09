import mongoose, { Schema } from "mongoose";
import { ICoupon } from "../shared/types/ICoupon";

const schema = new Schema<ICoupon>({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    couponName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    minAmount: {
        type: Number,
        required: true    
    },
    maxAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Expired'],
        default: "Active"
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

const couponModel = mongoose.model<ICoupon>("Coupon", schema);
export default couponModel;