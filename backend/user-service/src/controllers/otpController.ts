import { Request, Response } from "express";
import { UserProducer } from "../kafka/producer/userProducer";
import { StatusCode } from "../shared/constants/statusCode";
import { TOPICS } from "../kafka/topics";
import { IAuthService } from "../services/interfaces/IAuthService";
import { UserDTO } from "../shared/dtos/userDTO";
import { inject, injectable } from "tsyringe";

@injectable()
export class OTPController {
    constructor(
        @inject("IAuthService") private _authService: IAuthService, 
        @inject("UserProducer") private _producer: UserProducer<UserDTO>
    ) { }

    public getOtpTimer = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const result = await this._authService.getOtpTimer(userId as string);
        const data: { message: string, timeLeft?: number } = { message: result.message };
        if (result.status === StatusCode.OK) {
            data.timeLeft = result.timeLeft;
        }
        res.status(result.status).json(data);
    }

    public verifyOtp = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const { otp } = req.body;
        const result = await this._authService.verifyOtp(userId as string, otp, res);
        if (result.status === StatusCode.OK) {


            if (result.user) {
                this._producer.sendData(TOPICS.USER_CREATED, result.user);
            }
        }
        res.status(result.status).json({message: result.message, user: result.user});
    }

    public resendOtp = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const result = await this._authService.resendOtp(userId as string);
        res.status(result.status).json({message: result.message});
    }
}