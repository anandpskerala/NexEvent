import { Router } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { IUser } from "../shared/types/IUser";
import { UserRepository } from "../repositories/implementation/UserRepository";
import { OtpRepository } from "../repositories/implementation/OtpRepository";
import { ForgotRepository } from "../repositories/implementation/ForgotRepository";
import { AuthService } from "../services/implementation/authService";
import { AuthController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { googleAuthSchema, loginSchema, signupSchema } from "../shared/validators/authSchema";

const router = Router();

const producer = new UserProducer<IUser>();
const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const forgotRepo = new ForgotRepository();

const authService = new AuthService(userRepo, otpRepo, forgotRepo);
const authController = new AuthController(authService, producer);

router.post("/login", validate(loginSchema), authController.loginController);
router.post("/register", validate(signupSchema), authController.signupController);
router.delete("/logout", authController.logoutController);
router.post("/google", validate(googleAuthSchema), authController.googleAUth);
router.post("/token/refresh", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password", authController.resetPassword);
router.patch("/change-password", authController.changePassword);

export default router;
