import mongoose, { Schema } from "mongoose";
import { ChatRoom } from "../shared/types/ChatRoom";

const schema = new Schema<ChatRoom>({
    participants: {
        type: [String],
        required: true,
    },
    chatId: {
        type: String,
        required: true,
        unique: true,
    },
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

const chatRoomModel = mongoose.model<ChatRoom>("ChatRoom", schema);
export default chatRoomModel;