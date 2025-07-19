import { container } from "tsyringe";
import { AuthController } from "../controllers/authController";
import { OTPController } from "../controllers/otpController";
import { RequestController } from "../controllers/requestController";
import { ReviewController } from "../controllers/reviewController";
import { UserController } from "../controllers/userController";

export function registerControllers () {
    container.register<AuthController>(AuthController, {useClass: AuthController});
    container.register<OTPController>(OTPController, {useClass: OTPController});
    container.register<RequestController>(RequestController, {useClass: RequestController});
    container.register<ReviewController>(ReviewController, {useClass: ReviewController});
    container.register<UserController>(UserController, {useClass: UserController});
}