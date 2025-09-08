import { container } from "tsyringe";
import { IAnalyticsRepository } from "../repositories/interfaces/IAnalyticsRepository";
import { AnalyticsRepository } from "../repositories/implementation/AnalyticsRepository";
import { IEventRepository } from "../repositories/interfaces/IEventRepository";
import { EventRepository } from "../repositories/implementation/EventRepository";


export function registerRepositories() {
    container.register<IAnalyticsRepository>("IAnalyticsRepository", {useClass: AnalyticsRepository});
    container.register<IEventRepository>("IEventRepository", {useClass: EventRepository});
}