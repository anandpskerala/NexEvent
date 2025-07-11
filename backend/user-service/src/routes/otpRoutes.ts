import { Router } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { UserRepository } from "../repositories/implementation/UserRepository";
import { OtpRepository } from "../repositories/implementation/OtpRepository";
import { ForgotRepository } from "../repositories/implementation/ForgotRepository";
import { AuthService } from "../services/implementation/authService";
import { OTPController } from "../controllers/otpController";
import { UserDTO } from "../shared/dtos/userDTO";

const router = Router();

const producer = new UserProducer<UserDTO>();
const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const forgotRepo = new ForgotRepository();

const authService = new AuthService(userRepo, otpRepo, forgotRepo);
const otpController = new OTPController(authService, producer);

router.get("/", otpController.getOtpTimer);
router.post("/", otpController.verifyOtp);
router.patch("/", otpController.resendOtp);

export default router;
