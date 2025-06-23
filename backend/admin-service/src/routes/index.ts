import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import couponRoutes from "./couponRoutes";
import requestRoutes from "./requestRoutes";
import reportRoutes from "./reportRoutes";

const router = Router();

router.use("/category", categoryRoutes);
router.use("/coupon", couponRoutes);
router.use("/request", requestRoutes);
router.use("/report", reportRoutes);

export default router;
