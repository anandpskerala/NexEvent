import { container } from "tsyringe";
import { ConferenceController } from "../controllers/conferenceController";
import { MessageController } from "../controllers/messageController";
import { NotificationController } from "../controllers/notificationController";

export function registerControllers () {
    container.register<ConferenceController>(ConferenceController, {useClass: ConferenceController});
    container.register<MessageController>(MessageController, {useClass: MessageController});
    container.register<NotificationController>(NotificationController, {useClass: NotificationController});
}