import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { StatusCode } from "../shared/constants/statusCode";
import { config } from "../config";
import { UserProducer } from "../kafka/producer/userProducer";
import { IUser } from "../shared/types/user";
import { TOPICS } from "../kafka/topics";



export class AuthController {
    constructor(private authService: AuthService, private producer: UserProducer<IUser>) { }

    public loginController = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const result = await this.authService.loginUser(email, password);
        if (result.status === StatusCode.OK && result.user) {
            this.authService.authUtils.setAuthToken(res, result.user.id as string, result.user.roles);
        }
        res.status(result.status).json({ message: result.message, user: result.user });
    };

    public signupController = async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, password } = req.body;
        const result = await this.authService.registerUser(firstName, lastName, email, password);

        if (result.status === StatusCode.CREATED && result.user) {
            this.authService.authUtils.setAuthToken(res, result.user.id as string, result.user.roles);
        }

        res.status(result.status).json({ message: result.message, user: result.user });
    }


    public logoutController = async (req: Request, res: Response): Promise<void> => {
        const result = this.authService.logOut(res);
        res.status(result.status).json({ message: result.message });
    }

    public refreshToken = async (req: Request, res: Response): Promise<void> => {
        const token = req.cookies.refreshToken;
        const result = await this.authService.refreshToken(token);

        if (result.status === StatusCode.OK && result.user) {
            const { accessToken } = this.authService.authUtils.getTokens(result.user.id as string, result.user.roles);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: config.env === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
        }
        res.status(result.status).json({ message: result.message });
    }


    public googleAUth = async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, googleId } = req.body;
        const result = await this.authService.googleAuth(firstName, lastName, email, googleId);

        if ((result.status === StatusCode.OK || result.status === StatusCode.CREATED) && result.user) {
            this.authService.authUtils.setAuthToken(res, result.user?.id as string, result.user?.roles)

            if (result.status === StatusCode.CREATED) {
                try {
                    this.producer.sendData(TOPICS.USER_CREATED, result.user);
                } catch (error) {
                    console.error("Post-registration user fetch failed:", error);
                }
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