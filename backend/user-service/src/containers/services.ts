import { container } from "tsyringe";
import { IAuthService } from "../services/interfaces/IAuthService";
import { AuthService } from "../services/implementation/authService";
import { IRequestService } from "../services/interfaces/IRequestService";
import { RequestService } from "../services/implementation/requestService";
import { IReviewService } from "../services/interfaces/IReviewService";
import { ReviewService } from "../services/implementation/reviewService";
import { IUserService } from "../services/interfaces/IUserService";
import { UserService } from "../services/implementation/userService";


export function registerServices() {
    container.register<IAuthService>("IAuthService", {useClass: AuthService});
    container.register<IRequestService>("IRequestService", {useClass: RequestService});
    container.register<IReviewService>("IReviewService", {useClass: ReviewService});
    container.register<IUserService>("IUserService", {useClass: UserService});
}