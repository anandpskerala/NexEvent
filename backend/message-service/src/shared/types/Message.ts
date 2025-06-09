export interface Message {
    id?: string;
    sender: string;
    receiver: string;
    chatId?: string;
    content?: string;
    media?: string;
    createdAt?: string;
    updatedAt?: string;
}