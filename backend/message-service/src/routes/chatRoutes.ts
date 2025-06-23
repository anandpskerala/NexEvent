import { Router } from "express";
import { ChatRepository } from "../repositories/ChatRepository";
import { MessageService } from "../services/messageService";
import { MessageController } from "../controllers/messageController";

const router = Router();

const messageRepo = new ChatRepository();
const logic = new MessageService(messageRepo);
const controller = new MessageController(logic);

router.post("/chat", controller.sendMessage);
router.post("/interactions", controller.getInteractions);
router.get("/conversations/:id", controller.getMessages);
router.patch("/conversations/:id", controller.markAsRead);

export default router;
