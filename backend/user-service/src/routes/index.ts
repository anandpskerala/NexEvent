import { Router } from "express";
import authRoutes from "./authRoutes";
import otpRoutes from "./otpRoutes";
import userRoutes from "./userRoutes";
import requestRoutes from "./requestRoutes";
import reviewRoutes from "./reviewRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/review", reviewRoutes);
router.use("/", requestRoutes);
router.use("/", userRoutes);

export default router;
