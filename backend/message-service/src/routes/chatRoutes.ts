import { Router } from "express";
import { ChatRepository } from "../repositories/implementation/ChatRepository";
import { MessageService } from "../services/implementation/messageService";
import { MessageController } from "../controllers/messageController";
import { validate } from "../middlewares/validate";
import { messageSchema } from "../shared/validators/messageSchema";

const router = Router();

const messageRepo = new ChatRepository();
const logic = new MessageService(messageRepo);
const controller = new MessageController(logic);

router.post("/chat", validate(messageSchema), controller.sendMessage);
router.post("/interactions", controller.getInteractions);
router.get("/conversations/:id", controller.getMessages);
router.patch("/conversations/:id", controller.markAsRead);

export default router;
