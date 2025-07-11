import { Router } from "express";
import eventRoutes from "./eventRoutes";
import analyticsRoutes from "./analyticsRoutes";

const router = Router();

router.use("/", eventRoutes);
router.use("/", analyticsRoutes);

export default router;
