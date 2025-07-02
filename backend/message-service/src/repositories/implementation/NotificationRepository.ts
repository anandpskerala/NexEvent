import { Model } from "mongoose";
import notificationModel from "../../models/notificationModel";
import { INotification } from "../../shared/types/INotfication";
import { INotificationRepository } from "../interfaces/INotificationRepository";

export class NotificationRepository implements INotificationRepository {
    private readonly model: Model<INotification>;

    constructor() {
        this.model = notificationModel;
    }
    
    async create(notification: INotification): Promise<INotification> {
        const doc = await this.model.create(notification);
        return doc.toJSON();
    }

    async getUnreadByUser(userId: string): Promise<INotification[]> {
        const docs = (await this.model.find({ userId, read: false })).map(doc => doc.toJSON());
        return docs;
    }
    
    async markAsRead(userId: string): Promise<void> {
        await this.model.updateMany({userId, read: false}, {$set: {read: true}});
    }


    async getAllNotification(userId: string, offset: number, limit: number, isRead: boolean): Promise<{notifications: INotification[], total: number}> {
        const [docs, total] = await Promise.all([
            this.model.find({userId, read: isRead}).sort({createdAt: -1}).skip(offset).limit(limit),
            this.model.countDocuments({userId, read: isRead})
        ])

        const notifications = docs.map(doc => doc.toJSON());

        return {
            notifications,
            total
        }
    }
}