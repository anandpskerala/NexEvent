import { container } from "tsyringe";
import { IConferenceService } from "../services/interfaces/IConferenceService";
import { ConferenceService } from "../services/implementation/conferenceService";
import { IMessageService } from "../services/interfaces/IMessageService";
import { MessageService } from "../services/implementation/messageService";
import { INotificationService } from "../services/interfaces/INotificationService";
import { NotificationService } from "../services/implementation/notificationService";


export function registerServices() {
    container.register<IConferenceService>("IConferenceService", {useClass:  ConferenceService});
    container.register<IMessageService>("IMessageService", {useClass: MessageService});
    container.register<INotificationService>("INotificationService", {useClass: NotificationService});
}