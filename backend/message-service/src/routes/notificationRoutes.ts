import { Router } from "express";
import { NotificationController } from "../controllers/notificationController";
import { container } from "../containers";

const router = Router();

const controller = container.resolve(NotificationController);

router.get("/stream/:id", controller.notificationStream);
router.get("/all/:id", controller.getAllNotifications);
router.patch("/markallread/:id", controller.readAllNotifications);

export default router;
