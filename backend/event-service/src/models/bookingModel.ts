import mongoose, { Schema } from "mongoose";
import { IBooking } from "../shared/types/IBooking";
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);

const bookingSchema = new Schema<IBooking>({
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    tickets: [
        {
            ticketId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },
    ],
    paymentId: {
        type: String
    },
    orderId: {
        type: String,
        unique: true,
        default: () => {
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            return `NEX-${date}-${nanoid()}`;
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'stripe', 'wallet'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'cancelled'],
        default: 'pending'
    },
    couponCode: {
        type: String,
        default: null
    },
}, { timestamps: true });

bookingSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const bookingModel = mongoose.model('Booking', bookingSchema)
export default bookingModel;