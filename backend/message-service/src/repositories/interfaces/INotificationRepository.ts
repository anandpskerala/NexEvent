import { INotification } from "../../shared/types/INotfication";

export interface INotificationRepository {
    create(notification: INotification): Promise<INotification>;
    getUnreadByUser(userId: string): Promise<INotification[]>;
    markAsRead(userId: string): Promise<void>;
    getAllNotification(userId: string, offset: number, limit: number, isRead: boolean): Promise<{notifications: INotification[], total: number}>;
}