import { Message } from "../../shared/types/Message";

export interface IChatRepository {
    findRoom(user1: string, user2: string): Promise<string>;
    sendMessage(data: Partial<Message>): Promise<Message>;
    getInteractions(userId: string): Promise<string[]>;
    getMessage(peer1: string, peer2: string): Promise<Message[]>;
    create(data: Partial<Message>): Promise<Message>;
}