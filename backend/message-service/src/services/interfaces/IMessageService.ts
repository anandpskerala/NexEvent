import { Message } from "../../shared/types/Message";
import { MessageReturnType, UserReturnType, MessagePaginationType } from "../../shared/types/ReturnTypes";

export interface IMessageService {
    sendMessage(data: Message): Promise<MessageReturnType>;
    readMessage(userId: string, peerId: string): Promise<MessageReturnType>;
    getInteractedChats(userId: string): Promise<UserReturnType>;
    getMessages(peer1: string, peer2: string, limit: number, offset: number): Promise<MessagePaginationType>;
}