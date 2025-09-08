import { Router } from "express";
import { OTPController } from "../controllers/otpController";
import { container } from "../containers";

const router = Router();

const otpController = container.resolve(OTPController);

router.get("/", otpController.getOtpTimer);
router.post("/", otpController.verifyOtp);
router.patch("/", otpController.resendOtp);

export default router;
