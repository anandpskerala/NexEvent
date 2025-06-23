import { Router } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { IUser } from "../shared/types/user";
import { UserRepository } from "../repositories/UserRepository";
import { OtpRepository } from "../repositories/OtpRepository";
import { ForgotRepository } from "../repositories/ForgotRepository";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";

const router = Router();

const producer = new UserProducer<IUser>();
const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const forgotRepo = new ForgotRepository();

const authService = new AuthService(userRepo, otpRepo, forgotRepo);
const authController = new AuthController(authService, producer);

router.post("/login", authController.loginController);
router.post("/register", authController.signupController);
router.delete("/logout", authController.logoutController);
router.post("/google", authController.googleAUth);
router.post("/token/refresh", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password", authController.resetPassword);
router.patch("/change-password", authController.changePassword);

export default router;
