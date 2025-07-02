import { Request, Response } from "express";
import { StatusCode } from "../shared/constants/statusCode";
import { UserProducer } from "../kafka/producer/userProducer";
import { IUser } from "../shared/types/IUser";
import { TOPICS } from "../kafka/topics";
import { IAuthService } from "../services/interfaces/IAuthService";



export class AuthController {
    constructor(private authService: IAuthService, private producer: UserProducer<IUser>) { }

    public loginController = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const result = await this.authService.loginUser(email, password, res);
        res.status(result.status).json({ message: result.message, user: result.user });
    };

    public signupController = async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, password } = req.body;
        const result = await this.authService.registerUser(firstName, lastName, email, password, res);
        res.status(result.status).json({ message: result.message, user: result.user });
    }


    public logoutController = async (req: Request, res: Response): Promise<void> => {
        const result = this.authService.logOut(res);
        res.status(result.status).json({ message: result.message });
    }

    public refreshToken = async (req: Request, res: Response): Promise<void> => {
        const token = req.cookies.refreshToken;
        const result = await this.authService.refreshToken(token, res);
        res.status(result.status).json({ message: result.message });
    }


    public googleAUth = async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, googleId } = req.body;
        const result = await this.authService.googleAuth(firstName, lastName, email, googleId, res);

        if (result.status === StatusCode.CREATED && result.user) {
            try {
                this.producer.sendData(TOPICS.USER_CREATED, result.user);
            } catch (error) {
                console.error("Post-registration user fetch failed:", error);
            }
        }

        res.status(result.status).json({ message: result.message, user: result.user });
    }

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;
        const result = await this.authService.forgotPassword(email);
        res.status(result.status).json({ message: result.message })
    }

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { requestId, newPassword } = req.body;
        const result = await this.authService.resetPassword(requestId, newPassword);
        res.status(result.status).json({ message: result.message });
    }

    public changePassword = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const { currentPassword, newPassword } = req.body;
        const result = await this.authService.changePassword(userId as string, currentPassword, newPassword);
        res.status(result.status).json({ message: result.message });
    }
}