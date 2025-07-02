import redisClient from "../../../config/redis";
import { NotificationRepository } from "../../../repositories/implementation/NotificationRepository";
import { INotification } from "../../../shared/types/INotfication";

export class ConsumerHandler {
    constructor(private notificationRepository: NotificationRepository) {}

    async handleNewNotification(data: INotification) {
        if (data) {
            const notification = await this.notificationRepository.create(data);
            redisClient.publish(`notifications:${notification.userId}`, JSON.stringify(notification));
        }
    }
}