import { Router } from "express";
import authRoutes from "./authRoutes";
import otpRoutes from "./otpRoutes";
import userRoutes from "./userRoutes";
import requestRoutes from "./requestRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/", requestRoutes);
router.use("/", userRoutes);

export default router;
