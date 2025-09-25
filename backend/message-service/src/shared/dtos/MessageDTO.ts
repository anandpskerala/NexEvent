import { Message } from "../types/Message";

export interface MessageDTO {
    id: string;
    sender: string;
    receiver: string;
    chatId: string;
    content: string;
    media?: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const toMessageDTO = (entity: Message): MessageDTO => {
    return {
        id: entity.id as string,
        sender: entity.sender,
        receiver: entity.receiver,
        chatId: entity.chatId as string,
        content: entity.content as string,
        media: entity.media as string,
        isRead: entity.isRead as boolean,
        createdAt: entity.createdAt as string,
        updatedAt: entity.updatedAt as string
    }
}