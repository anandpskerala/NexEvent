import { Router } from "express";
import chatRoutes from "./chatRoutes";
import conferenceRoutes from "./conferenceRoutes";
import notificationRoutes from "./notificationRoutes";

const router = Router();

router.use("/", chatRoutes);
router.use("/conference", conferenceRoutes);
router.use("/notifications", notificationRoutes);

export default router;
