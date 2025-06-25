import mongoose, { Schema } from "mongoose";
import { ISavedEvents } from "../shared/types/ISavedEvents";


const schema = new Schema<ISavedEvents>({
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    }
}, {
    timestamps: true
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const savedEventsModel = mongoose.model<ISavedEvents>("SavedEvent", schema);
export default savedEventsModel;