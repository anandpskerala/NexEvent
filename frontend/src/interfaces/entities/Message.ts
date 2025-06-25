export interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  chatId?: string;
  media?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}