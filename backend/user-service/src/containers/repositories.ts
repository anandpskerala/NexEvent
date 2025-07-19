import { container } from "tsyringe";
import { IForgotRepository } from "../repositories/interfaces/IForgotRepository";
import { ForgotRepository } from "../repositories/implementation/ForgotRepository";
import { IOtpRepository } from "../repositories/interfaces/IOtpRepository";
import { OtpRepository } from "../repositories/implementation/OtpRepository";
import { IRequestRepository } from "../repositories/interfaces/IRequestRepository";
import { RequestRepository } from "../repositories/implementation/RequestRepository";
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";
import { ReviewRepository } from "../repositories/implementation/ReviewRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/implementation/UserRepository";


export function registerRepositories() {
    container.register<IForgotRepository>("IForgotRepository", {useClass: ForgotRepository});
    container.register<IOtpRepository>("IOtpRepository", {useClass: OtpRepository});
    container.register<IRequestRepository>("IRequestRepository", {useClass: RequestRepository});
    container.register<IReviewRepository>("IReviewRepository", {useClass: ReviewRepository});
    container.register<IUserRepository>("IUserRepository", {useClass: UserRepository});
}