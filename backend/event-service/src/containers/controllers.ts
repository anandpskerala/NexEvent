import { container } from "tsyringe";
import { AnalyticsController } from "../controllers/analyticsController";
import { EventController } from "../controllers/eventController";

export function registerControllers () {
    container.register<AnalyticsController>(AnalyticsController, {useClass: AnalyticsController});
    container.register<EventController>(EventController, {useClass: EventController});
}