import { INotification } from "../types/INotfication";

export interface NotificationDTO {
    id: string;
    userId: string;
    title: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
}

export const toNotificationDTO = (entity: INotification): NotificationDTO => {
    return {
        id: entity.id as string,
        userId: entity.userId,
        title: entity.title,
        type: entity.type,
        message: entity.message,
        read: entity.read as boolean,
        createdAt: entity.createdAt as Date
    }
}