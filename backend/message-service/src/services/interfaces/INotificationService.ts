import { UnreadReturnType, UnreadPaginationType } from "../../shared/types/ReturnTypes";

export interface INotificationService {
    getUnreads(userId: string): Promise<UnreadReturnType>;
    markAllAsRead(userId: string): Promise<UnreadReturnType>;
    getAllNotification(userId: string, page: number, limit: number, isRead?: boolean): Promise<UnreadPaginationType>;
}