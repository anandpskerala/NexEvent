import { Router } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { IUser } from "../shared/types/IUser";
import { UserRepository } from "../repositories/UserRepository";
import { OtpRepository } from "../repositories/OtpRepository";
import { ForgotRepository } from "../repositories/ForgotRepository";
import { AuthService } from "../services/authService";
import { OTPController } from "../controllers/otpController";

const router = Router();

const producer = new UserProducer<IUser>();
const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const forgotRepo = new ForgotRepository();

const authService = new AuthService(userRepo, otpRepo, forgotRepo);
const otpController = new OTPController(authService, producer);

router.get("/", otpController.getOtpTimer);
router.post("/", otpController.verifyOtp);
router.patch("/", otpController.resendOtp);

export default router;
