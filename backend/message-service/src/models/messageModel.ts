import mongoose, { Schema } from "mongoose";
import { Message } from "../shared/types/Message";
import { v4 as uuid } from "uuid";

const schema = new Schema<Message>({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    chatId: {
        type: String,
        default: uuid,
    },
    content: {
        type: String
    },
    media: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }
);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const messageModel = mongoose.model<Message>("Message", schema);
export default messageModel;