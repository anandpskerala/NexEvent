import { container } from "tsyringe";
import { IAnalyticService } from "../services/interfaces/IAnalyticService";
import { AnalyticService } from "../services/implementation/analyticService";
import { IEventService } from "../services/interfaces/IEventService";
import { EventService } from "../services/implementation/eventService";


export function registerServices() {
    container.register<IAnalyticService>("IAnalyticService", {useClass: AnalyticService});
    container.register<IEventService>("IEventService", {useClass: EventService});
}