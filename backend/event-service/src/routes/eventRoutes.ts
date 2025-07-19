import { Router } from "express";
import { EventController } from "../controllers/eventController";
import { protectedRoute } from "../middlewares/protectedRoute";
import { validate } from "../middlewares/validate";
import { createTicketSchema, editEventSchema, editTicketSchema, eventSchema } from "../shared/validators/eventSchema";
import { container } from "../containers";

const router = Router();

const eventController = container.resolve(EventController);

router.get("/all", eventController.getAllEvents);
router.post("/stocks", eventController.checkStock);
router.post("/event", protectedRoute, validate(eventSchema), eventController.createEvent);
router.get("/events", eventController.getEvents);
router.get("/nearbyevents", eventController.getNearByEvents);
router.post("/ticket", protectedRoute, validate(createTicketSchema), eventController.createTicket);
router.get("/event/:id", eventController.getEvent);
router.patch("/event/:id", protectedRoute, validate(editEventSchema), eventController.editEvent);
router.patch("/ticket/:id", protectedRoute, validate(editTicketSchema), eventController.editTicket);

router.get("/all-saved", eventController.getAllSaved);
router.get("/saved/:id", eventController.checkSaved);
router.post("/saved/:id", eventController.saveEvent);
router.delete("/saved/:id", eventController.removeSaved);

export default router;
