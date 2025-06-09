import { Document } from "mongoose";

export interface ChatRoom extends Document {
    id?: string;
    participants: string[];
    chatId: string;
}