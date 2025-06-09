import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IChatRepository } from "./interfaces/IChatRepository";
import { Message } from "../shared/types/Message";
import { ChatRoom } from "../shared/types/ChatRoom";
import messageModel from "../models/messageModel";
import chatRoomModel from "../models/chatRoomModel";

export class ChatRepository implements IChatRepository {
    private model: Model<Message>;
    private chatRoom: Model<ChatRoom>;

    constructor() {
        this.model = messageModel;
        this.chatRoom = chatRoomModel;
    }

    async findRoom(user1: string, user2: string): Promise<string> {
        const participants = [user1, user2].sort();
        let chatRoom = await this.chatRoom.findOne({ participants });

        if (!chatRoom) {
            const newChatId = uuidv4();
            chatRoom = await this.chatRoom.create({ participants, chatId: newChatId });
        }

        return chatRoom.chatId;
    }

    async sendMessage(data: Partial<Message>): Promise<Message> {
        const chatRoom = await this.findRoom(data.sender as string, data.receiver as string);
        const chat = await this.create({
            ...data,
            chatId: chatRoom
        });
        return chat;
    }

    async getInteractions(userId: string): Promise<string[]> {
        const messages = await this.model.find({
            $or: [{ sender: userId }, { reciever: userId }]
        }).select('sender reciever');

        const interacted = new Set<string>();
        messages.forEach(msg => {
            if (msg.sender !== userId) interacted.add(msg.sender);
            if (msg.receiver !== userId) interacted.add(msg.receiver);
        });

        const ids = Array.from(interacted);
        return ids;
    }

    async getMessage(peer1: string, peer2: string): Promise<Message[]> {
        try {
            const messages = (await this.model.find({
                $or: [
                    { sender: peer1, receiver: peer2 },
                    { sender: peer2, receiver: peer1 }
                ]
            }).sort({ createdAt: 1 })).map(doc => doc.toJSON());

            return messages as Message[];
        } catch (err) {
            console.error("MongoDB query failed:", err);
            throw err;
        }
    }

    async create(data: Partial<Message>): Promise<Message> {
        const doc = await this.model.create(data);
        return doc.toJSON();
    }
}