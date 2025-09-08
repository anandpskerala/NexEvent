import { container } from "tsyringe";
import { IConferenceService } from "../services/interfaces/IConferenceService";
import { ConferenceService } from "../services/implementation/conferenceService";
import { IMessageService } from "../services/interfaces/IMessageService";
import { MessageService } from "../services/implementation/messageService";
import { INotificationService } from "../services/interfaces/INotificationService";
import { NotificationService } from "../services/implementation/notificationService";
import { IKafkaProducer } from "../kafka/producer/IKafkaProducer";
import { KafkaProducer } from "../kafka/producer/kafkaProducer";
import kafka from "../kafka";
import { Kafka } from "kafkajs";


export function registerServices() {
    container.register<IConferenceService>("IConferenceService", { useClass: ConferenceService });
    container.register<IMessageService>("IMessageService", { useClass: MessageService });
    container.register<INotificationService>("INotificationService", { useClass: NotificationService });
    container.register<IKafkaProducer>("IKafkaProducer", { useClass: KafkaProducer });
    container.registerInstance(Kafka, kafka);
}