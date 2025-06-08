import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { StatusCode } from "../shared/constants/statusCode";
import { AuthUtils } from "../shared/utils/authUtils";
import { OtpReturnType, UserReturnType } from "../shared/types/returnTypes";
import { OtpRepository } from "../repositories/OtpRepository";
import { Response } from "express";
import { config } from "../config";
import { ForgotRepository } from "../repositories/ForgotRepository";
import { sendOtpMail, sendResetPasswordMail } from "../shared/utils/mailer";

export class AuthService {
    public authUtils: AuthUtils;
    constructor(
        private userRepo: UserRepository,
        private otpRepo: OtpRepository,
        private forgotRepo: ForgotRepository,
    ) {
        this.authUtils = new AuthUtils();
    }

    public async loginUser(email: string, password: string): Promise<UserReturnType> {
        try {
            if (!email?.trim() || !password?.trim()) {
                return {
                    message: "Email / Password not provided",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const user = await this.userRepo.findByEmail(email);

            if (!user || user.authProvider !== "email") {
                return {
                    message: "Email or password is incorrect",
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (user.isBlocked) {
                return {
                    message: "Your account has been blocked",
                    status: StatusCode.FORBIDDEN
                }
            }

            const validPassword = await this.authUtils.comparePassword(password, user.password as string);
            if (!validPassword) {
                return {
                    message: "Email or password is incorrect",
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (!user.isVerified) {
                const otp = await this.otpRepo.findOtp(user.id as string);
                if (!otp) {
                    const otpNumber = this.authUtils.generateOtp();
                    await this.otpRepo.create({
                        userId: new Types.ObjectId(user.id),
                        otp: otpNumber,
                    });

                    this.authUtils.sendOtp(user.email, otpNumber);
                }
                return {
                    message: "Otp sent to email",
                    status: StatusCode.OK,
                    user
                }
            }

            return {
                message: "Login successful",
                status: StatusCode.OK,
                user
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async registerUser(firstName: string, lastName: string, email: string, password: string): Promise<UserReturnType> {
        try {
            if (!firstName || firstName.trim() === "" || !lastName || lastName === "" || !email || email === "" || !password || password === "") {
                return {
                    message: "All fields are required",
                    status: StatusCode.BAD_REQUEST
                }
            }
            let user = await this.userRepo.findByEmail(email);
            if (user) {
                return {
                    message: "User already exists",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const hashedPassword = await this.authUtils.hashPassword(password);
            user = await this.userRepo.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                authProvider: "email"
            });

            const otpNumber = this.authUtils.generateOtp();
            await this.otpRepo.create({
                userId: new Types.ObjectId(user.id),
                otp: otpNumber
            })

            this.authUtils.sendOtp(user.email, otpNumber);

            return {
                message: "Otp sent to email",
                status: StatusCode.CREATED,
                user
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    };

    public logOut(res: Response): { message: string, status: StatusCode } {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return {
                message: "Logout successful",
                status: StatusCode.OK
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal Server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async refreshToken(token: string): Promise<UserReturnType> {
        try {
            if (!token) {
                return {
                    message: "No refresh token found",
                    status: StatusCode.UNAUTHORIZED
                }
            }

            const decoded = jwt.verify(token, config.jwt.refreshTokenSecret) as { userId: string };

            const user = await this.userRepo.findByID(decoded.userId);
            if (!user) {
                return {
                    message: "User not found",
                    status: StatusCode.NOT_FOUND
                }
            }
            return {
                message: "Token refreshed",
                status: StatusCode.OK,
                user
            }
        } catch (error) {
            console.log(error)
            return {
                message: "Invalid refresh token",
                status: StatusCode.FORBIDDEN
            }
        }
    }

    public async googleAuth(firstName: string, lastName: string, email: string, googleId: string): Promise<UserReturnType> {
        try {
            if (!firstName || firstName.trim() === "" || !email || email.trim() === "" || !googleId || googleId.trim() === "") {
                return {
                    message: "All fields are required",
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (!lastName) {
                lastName = " "
            }

            let user = await this.userRepo.findByEmail(email);
            if (user) {
                if (!user.googleId) {
                    return {
                        message: "User already exists",
                        status: StatusCode.FORBIDDEN
                    }
                }

                if (user.isBlocked) {
                    return {
                        message: "Forbidden: you have been blocked",
                        status: StatusCode.FORBIDDEN
                    }
                }

                return {
                    message: "Login successful",
                    status: StatusCode.OK,
                    user
                }
            } else {
                user = await this.userRepo.create({
                    firstName,
                    lastName,
                    email,
                    googleId,
                    authProvider: "google",
                    isVerified: true
                })
                return {
                    message: "Signup successful",
                    status: StatusCode.CREATED,
                    user
                }
            }

        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async forgotPassword(email: string): Promise<UserReturnType> {
        try {
            if (!email || email.trim() === "") {
                return {
                    message: "Email not found",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const user = await this.userRepo.findByEmail(email, "email");
            if (!user) {
                return {
                    message: "User doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            let request = await this.forgotRepo.findByUserId(user.id as string);
            if (!request) {
                request = await this.forgotRepo.create({ userId: new Types.ObjectId(user.id) });
                sendResetPasswordMail(user.email, request.requestId);
            }

            return {
                message: "Reset email sent",
                status: StatusCode.CREATED
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async resetPassword(requestId: string, newPassword: string): Promise<UserReturnType> {
        try {
            if (!requestId || requestId.trim() === "") {
                return {
                    message: "Request ID not found",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const request = await this.forgotRepo.findByID(requestId);
            if (!request) {
                return {
                    message: "Request timeout / Not found",
                    status: StatusCode.NOT_FOUND
                }
            }

            const user = await this.userRepo.findByID(new String(request.userId).toString());
            if (!user) {
                return {
                    message: "User doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            await this.forgotRepo.delete(request.requestId);

            const hashedPassword = await this.authUtils.hashPassword(newPassword);
            await this.userRepo.update(user.id as string, { password: hashedPassword });
            return {
                message: "Password changed",
                status: StatusCode.OK
            }
        } catch (error) {
            console.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getOtpTimer(userId: string): Promise<OtpReturnType> {
        try {
            if (!userId) {
                return {
                    message: "User Not found",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const otp = await this.otpRepo.findOtp(userId);
            if (!otp) {
                return {
                    message: "No otp found",
                    status: StatusCode.OK,
                    timeLeft: 0
                }
            }

            const expiry = new Date(otp?.expiry);
            const now = new Date();
            let timeLeft = 0;
            if (expiry > now) {
                timeLeft = Math.floor((expiry.getTime() - now.getTime()) / 1000);
            }

            return {
                message: "Fetched Otp data",
                status: StatusCode.OK,
                timeLeft: timeLeft
            }
        } catch (error) {
            console.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async verifyOtp(userId: string, otp: number): Promise<UserReturnType> {
        try {
            if (!userId || !otp) {
                return {
                    message: "Invalid input request",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const checkOtp = await this.otpRepo.findOtp(userId, otp);
            if (!checkOtp) {
                return {
                    message: "Otp Invalid / Expired",
                    status: StatusCode.NOT_FOUND
                }
            }
            const user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    message: "User doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            await this.userRepo.update(user.id as string, { isVerified: true })
            await this.otpRepo.delete(checkOtp.id)

            return {
                message: "Otp verified",
                status: StatusCode.OK,
                user: { ...user, isVerified: true }
            }
        } catch (error) {
            console.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async resendOtp(userId: string): Promise<UserReturnType> {
        try {
            if (!userId) {
                return {
                    message: "Invalid User ID",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    message: "User doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            const existing = await this.otpRepo.findOtp(userId);
            if (existing) {
                await this.otpRepo.delete(existing.id);
            }
            const otpNumber = this.authUtils.generateOtp();
            await this.otpRepo.create({
                userId: new Types.ObjectId(user.id),
                otp: otpNumber
            })

            sendOtpMail(user.email, otpNumber);
            return {
                message: "Otp sent",
                status: StatusCode.CREATED
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserReturnType> {
        try {
            if (!userId) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "User ID missing"
                }
            }

            const user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: "User not found"
                }
            }

            if (!currentPassword || currentPassword.trim() === "" || !newPassword || newPassword.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "Fill all the required fields"
                }
            }

            if (currentPassword == newPassword) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "New password can't be the current password"
                }
            }

            const verify = await this.authUtils.comparePassword(currentPassword, user.password as string);

            if (!verify) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "Current password doesn't match"
                }
            }

            const hashedPassword = await this.authUtils.hashPassword(newPassword);
            await this.userRepo.update(user.id as string, { password: hashedPassword });
            return {
                status: StatusCode.OK,
                message: "Password changed"
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}