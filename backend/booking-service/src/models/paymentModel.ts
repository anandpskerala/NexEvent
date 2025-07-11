import mongoose, { Schema } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../shared/types/Payments";
import { IPayment } from "../shared/types/IPayment";

const PaymentSchema: Schema = new Schema<IPayment>(
    {
        userId: { 
            type: String, 
            required: true 
        },
        eventId: { 
            type: String, 
            required: true 
        },
        bookingId: {
            type: String,
            required: true
        },
        orderId: { 
            type: String 
        },
        paymentId: { 
            type: String 
        },
        method: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        amount: { 
            type: Number, 
            required: true 
        },
        currency: { 
            type: String, 
            default: "INR" 
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

PaymentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});
const paymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
export default paymentModel;