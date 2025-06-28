import { Router } from "express";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { NotificationService } from "../services/notificationService";
import { NotificationController } from "../controllers/notificationController";

const router = Router();

const notificationRepo = new NotificationRepository();
const notificationService = new NotificationService(notificationRepo);
const controller = new NotificationController(notificationService);

router.get("/stream/:id", controller.notificationStream);
router.get("/all/:id", controller.getAllNotifications);
router.patch("/markallread/:id", controller.readAllNotifications);

export default router;
