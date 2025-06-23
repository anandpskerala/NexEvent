import { Model } from "mongoose";
import notificationModel from "../models/notificationModel";
import { INotification } from "../shared/types/INotfication";
import { INotificationRepository } from "./interfaces/INotificationRepository";

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

    
}