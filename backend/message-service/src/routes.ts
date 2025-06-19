import { Router } from "express";
import { MessageController } from "./controllers/messageController";
import { MessageService } from "./services/messageService";
import { ChatRepository } from "./repositories/ChatRepository";
import { ConferenceService } from "./services/conferenceService";
import { ConferenceController } from "./controllers/conferenceController";

const routes = Router();
const messageRepo = new ChatRepository();
const logic = new MessageService(messageRepo);
const controller = new MessageController(logic);

const conferenceService = new ConferenceService();
const conferenceController = new ConferenceController(conferenceService);

routes.post("/chat", controller.sendMessage);
routes.post("/interactions", controller.getInteractions);
routes.get("/conversations/:id", controller.getMessages);
routes.patch("/conversations/:id", controller.markAsRead);


routes.post("/conference/token", conferenceController.getToken);

export default routes;