import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { googleAuthSchema, loginSchema, signupSchema } from "../shared/validators/authSchema";
import { container } from "../containers";

const router = Router();

const authController = container.resolve(AuthController)

router.post("/login", validate(loginSchema), authController.loginController);
router.post("/register", validate(signupSchema), authController.signupController);
router.delete("/logout", authController.logoutController);
router.post("/google", validate(googleAuthSchema), authController.googleAUth);
router.post("/token/refresh", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password", authController.resetPassword);
router.patch("/change-password", authController.changePassword);

export default router;
