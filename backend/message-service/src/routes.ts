import { Router } from "express";
import { MessageController } from "./controllers/messageController";
import { MessageService } from "./services/messageService";
import { ChatRepository } from "./repositories/ChatRepository";

const routes = Router();
const messageRepo = new ChatRepository();
const logic = new MessageService(messageRepo);
const controller = new MessageController(logic);

routes.post("/chat", controller.sendMessage);
routes.post("/interactions", controller.getInteractions);
routes.get("/conversations/:id", controller.getMessages);
routes.patch("/conversations/:id", controller.markAsRead);

export default routes;