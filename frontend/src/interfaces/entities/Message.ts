export interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  chatId?: string;
  media?: string;
  createdAt?: string;
  updatedAt?: string;
}