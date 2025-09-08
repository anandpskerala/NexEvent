import kafka from "../..";
import { INotificationRepository } from "../../../repositories/interfaces/INotificationRepository";
import { INotification } from "../../../shared/types/INotfication";
import { KafkaProducer } from "../../producer/kafkaProducer";
import { TOPICS } from "../../topics";

export class ConsumerHandler {
    private producer: KafkaProducer;
    constructor(private notificationRepository: INotificationRepository) {
        this.producer = new KafkaProducer(kafka);
    }

    async handleNewNotification(data: INotification) {
        if (data) {
            const notification = await this.notificationRepository.create(data);
            this.producer.sendData<INotification>(TOPICS.NOTIFICATION_CREATED, notification);
        }
    }
}