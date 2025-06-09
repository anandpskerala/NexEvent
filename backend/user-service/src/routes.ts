import { Router } from "express";
import { AuthController } from "./controllers/authController";
import { UserProducer } from "./kafka/producer/userProducer";
import { IUser } from "./shared/types/user";
import { AuthService } from "./services/authService";
import { UserRepository } from "./repositories/UserRepository";
import { OtpRepository } from "./repositories/OtpRepository";
import { ForgotRepository } from "./repositories/ForgotRepository";
import { OTPController } from "./controllers/otpController";
import { UserController } from "./controllers/userController";
import { UserService } from "./services/userService";
import { RequestController } from "./controllers/requestController";
import { RequestService } from "./services/requestService";
import { RequestRepository } from "./repositories/RequestRepository";
import { protectedRoute } from "./middlewares/protectedRoute";
import { adminRoute } from "./middlewares/adminRoute";

const routes = Router();

const producer = new UserProducer<IUser>();
const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const forgotRepo = new ForgotRepository();
const requestRepo = new RequestRepository();

const authService = new AuthService(userRepo, otpRepo, forgotRepo);
const userService = new UserService(userRepo);
const requestService = new RequestService(requestRepo, userRepo);

const authController = new AuthController(authService, producer);
const otpController = new OTPController(authService, producer);
const userController = new UserController(userService, producer);
const requestController = new RequestController(requestService);


routes.post("/auth/login", authController.loginController);
routes.post("/auth/register", authController.signupController);
routes.delete("/auth/logout", authController.logoutController);
routes.post("/auth/google", authController.googleAUth);
routes.post("/token/refresh", authController.refreshToken);
routes.post("/forgot-password", authController.forgotPassword);
routes.patch("/reset-password", authController.resetPassword);
routes.patch("/change-password", authController.changePassword);

routes.get("/otp", otpController.getOtpTimer);
routes.post("/otp", otpController.verifyOtp);
routes.patch("/otp", otpController.resendOtp);

routes.post("/verify", userController.verifyUser);
routes.get("/users", userController.getAllUsers);
routes.post("/bulk/users", userController.getBulkUsers);
routes.patch("/me/profile", protectedRoute, userController.updateProfile);
routes.patch("/me/profile-image", protectedRoute, userController.updateProfileImage);

routes.get("/requests", requestController.getAllRequests);
routes.post("/request/:id", protectedRoute, requestController.createRequest);
routes.get("/request/:id", requestController.getRequest);
routes.delete("/request/:id", protectedRoute, requestController.deleteRequest);
routes.patch("/request/:id", adminRoute, requestController.updateOrganizerRequest);

routes.get("/:id", userController.getUser);
routes.patch("/:id", adminRoute, userController.updateUser);
routes.delete("/:id", adminRoute, userController.deleteUser);


export default routes;