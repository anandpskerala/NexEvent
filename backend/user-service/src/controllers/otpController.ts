import { Request, Response } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { IUser } from "../shared/types/IUser";
import { StatusCode } from "../shared/constants/statusCode";
import { TOPICS } from "../kafka/topics";
import { IAuthService } from "../services/interfaces/IAuthService";

export class OTPController {
    constructor(private authService: IAuthService, private producer: UserProducer<IUser>) { }

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
        const result = await this.authService.verifyOtp(userId as string, otp, res);
        if (result.status === StatusCode.OK) {


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