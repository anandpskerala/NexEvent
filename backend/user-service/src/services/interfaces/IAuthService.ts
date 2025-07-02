import { Response } from "express";
import { StatusCode } from "../../shared/constants/statusCode";
import { UserReturnType, OtpReturnType } from "../../shared/types/ReturnTypes";

export interface IAuthService {
    loginUser(email: string, password: string, res: Response): Promise<UserReturnType>;
    registerUser(firstName: string, lastName: string, email: string, password: string, res: Response): Promise<UserReturnType>;
    logOut(res: Response): { message: string, status: StatusCode };
    refreshToken(token: string, res: Response): Promise<UserReturnType>;
    googleAuth(firstName: string, lastName: string, email: string, googleId: string, res: Response): Promise<UserReturnType>;
    forgotPassword(email: string): Promise<UserReturnType>;
    resetPassword(requestId: string, newPassword: string): Promise<UserReturnType>;
    getOtpTimer(userId: string): Promise<OtpReturnType>;
    verifyOtp(userId: string, otp: number, res: Response): Promise<UserReturnType>;
    resendOtp(userId: string): Promise<UserReturnType>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserReturnType>;
    
}