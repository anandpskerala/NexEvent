import { Request, Response } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { AuthService } from "../services/authService";
import { IUser } from "../shared/types/IUser";
import { StatusCode } from "../shared/constants/statusCode";
import { config } from "../config";
import { TOPICS } from "../kafka/topics";

export class OTPController {
    constructor(private authService: AuthService, private producer: UserProducer<IUser>) { }

    public getOtpTimer = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const result = await this.authService.getOtpTimer(userId as string);
        const data: { message: string, timeLeft?: number } = { message: result.message };
        if (result.status === StatusCode.OK) {
            data.timeLeft = result.timeLeft;
        }
        res.status(result.status).json(data);
    }

    public verifyOtp = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const { otp } = req.body;
        const result = await this.authService.verifyOtp(userId as string, otp);
        if (result.status === StatusCode.OK) {
            const { accessToken, refreshToken } = this.authService.authUtils.getTokens(result.user?.id as string, result.user?.roles as []);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: config.env === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.env === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            if (result.user) {
                this.producer.sendData(TOPICS.USER_CREATED, result.user);
            }
        }
        res.status(result.status).json({message: result.message, user: result.user});
    }

    public resendOtp = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const result = await this.authService.resendOtp(userId as string);
        res.status(result.status).json({message: result.message});
    }
}