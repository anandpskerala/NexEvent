import mongoose, { Schema, Types } from "mongoose";
import { IEvent } from "../shared/types/IEvent";
import { ITicket } from "../shared/types/ITicket";

const ticketSchema = new Schema<ITicket>({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["paid", "free"],
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    _id: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (_, ret) => {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

const locationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: true,
        },
        place: { type: String },
    },
    { _id: false }
);


const schema = new Schema<IEvent>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        required: true
    },
    image: {
        type: String,
        require: true
    },
    category: {
        type: Types.ObjectId,
        required: true
    },
    eventType: {
        type: String,
        enum: ["virtual", "offline"],
        required: true
    },
    entryType: {
        type: String,
        enum: ["paid", "free"]
    },
    tags: {
        type: [String],
        required: false
    },
    eventFormat: {
        type: String,
        enum: ["single", "multiple"],
        required: true
    },
    tickets: {
        type: [ticketSchema],
        required: false
    },
    currency: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "cancelled", "ended"],
        default: "upcoming"
    },
    location: locationSchema,
    showQuantity: {
        type: Boolean,
        required: false
    },
    refunds: {
        type: Boolean,
        required: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: false
    },
    endTime: {
        type: String,
        required: false
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
schema.index({ location: "2dsphere" });

const eventModel = mongoose.model("Event", schema);
export default eventModel;