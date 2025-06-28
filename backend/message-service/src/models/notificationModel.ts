import mongoose, { Schema } from "mongoose";
import { INotification } from "../shared/types/INotfication";

const schema = new Schema<INotification>({
    userId: { 
        type: String, 
        required: true 
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: { 
        type: Boolean, 
        default: false 
    },
}, {timestamps: true});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const notificationModel = mongoose.model<INotification>("Notification", schema);
export default notificationModel;