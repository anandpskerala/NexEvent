import { Router } from "express";
import { MessageController } from "../controllers/messageController";
import { validate } from "../middlewares/validate";
import { messageSchema } from "../shared/validators/messageSchema";
import { container } from "../containers";

const router = Router();

const controller = container.resolve(MessageController);

router.post("/chat", validate(messageSchema), controller.sendMessage);
router.post("/interactions", controller.getInteractions);
router.get("/conversations/:id", controller.getMessages);
router.patch("/conversations/:id", controller.markAsRead);

export default router;
