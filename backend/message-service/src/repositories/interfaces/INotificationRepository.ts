import { INotification } from "../../shared/types/INotfication";

export interface INotificationRepository {
    create(notification: INotification): Promise<INotification>;
    getUnreadByUser(userId: string): Promise<INotification[]>;
    markAsRead(userId: string): Promise<void>;
}