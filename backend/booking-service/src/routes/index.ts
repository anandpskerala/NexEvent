import { Router } from "express";
import bookingRoutes from "./bookingRoutes";
import paymentRoutes from "./paymentRoutes";

const router = Router();

router.use("/", bookingRoutes);
router.use("/", paymentRoutes);

export default router;
