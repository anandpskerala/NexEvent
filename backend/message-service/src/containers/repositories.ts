import { container } from "tsyringe";
import { IChatRepository } from "../repositories/interfaces/IChatRepository";
import { ChatRepository } from "../repositories/implementation/ChatRepository";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";
import { NotificationRepository } from "../repositories/implementation/NotificationRepository";


export function registerRepositories() {
    container.register<IChatRepository>("IChatRepository", {useClass: ChatRepository});
    container.register<INotificationRepository>("INotificationRepository", {useClass: NotificationRepository});
}