import { Router } from "express";
import eventRoutes from "./eventRoutes";
import bookingRoutes from "./bookingRoutes";
import paymentRoutes from "./paymentRoutes";
import analyticsRoutes from "./analyticsRoutes";

const router = Router();

router.use("/", eventRoutes);
router.use("/", bookingRoutes);
router.use("/", paymentRoutes);
router.use("/", analyticsRoutes);

export default router;
