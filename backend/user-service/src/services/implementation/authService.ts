import jwt from "jsonwebtoken";
import { StatusCode } from "../../shared/constants/statusCode";
import { AuthUtils } from "../../shared/utils/authUtils";
import { OtpReturnType, UserReturnType } from "../../shared/types/ReturnType";
import { Response } from "express";
import { config } from "../../config";
import { sendOtpMail, sendResetPasswordMail } from "../../shared/utils/mailer";
import logger from "../../shared/utils/logger";
import { IAuthService } from "../interfaces/IAuthService";
import { IForgotRepository } from "../../repositories/interfaces/IForgotRepository";
import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { toUserDTO } from "../../shared/mappers/userMapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthService implements IAuthService {
    public authUtils: AuthUtils;
    constructor(
        @inject("IUserRepository") private _userRepo: IUserRepository,
        @inject("IOtpRepository") private _otpRepo: IOtpRepository,
        @inject("IForgotRepository") private _forgotRepo: IForgotRepository,
    ) {
        this.authUtils = new AuthUtils();
    }

    public async loginUser(email: string, password: string, res: Response): Promise<UserReturnType> {
        try {
            const user = await this._userRepo.findByEmail(email);

            if (!user || user.authProvider !== "email") {
                return {
                    message: HttpResponse.INVALID_CREDENTIALS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (user.isBlocked) {
                return {
                    message: HttpResponse.ACCOUNT_BLOCKED,
                    status: StatusCode.FORBIDDEN
                }
            }

            const validPassword = await this.authUtils.comparePassword(password, user.password as string);
            if (!validPassword) {
                return {
                    message: HttpResponse.INVALID_CREDENTIALS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            this.authUtils.setAuthToken(res, user.id as string, user.roles);
            if (!user.isVerified) {
                const otp = await this._otpRepo.findOtp(user.id as string);
                if (!otp) {
                    const otpNumber = this.authUtils.generateOtp();
                    await this._otpRepo.create({
                        userId: user.id,
                        otp: otpNumber,
                    });

                    this.authUtils.sendOtp(user.email, otpNumber);
                }
                return {
                    message: HttpResponse.OTP_SENT,
                    status: StatusCode.OK,
                    user: toUserDTO(user)
                }
            }

            return {
                message: HttpResponse.LOGIN_SUCCESSFUL,
                status: StatusCode.OK,
                user: toUserDTO(user)
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async registerUser(firstName: string, lastName: string, email: string, password: string, res: Response): Promise<UserReturnType> {
        try {
            let user = await this._userRepo.findByEmail(email);
            if (user) {
                return {
                    message: HttpResponse.USER_ALREADY_EXISTS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const hashedPassword = await this.authUtils.hashPassword(password);
            user = await this._userRepo.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                authProvider: "email"
            });

            const otpNumber = this.authUtils.generateOtp();
            await this._otpRepo.create({
                userId: user.id,
                otp: otpNumber
            })

            this.authUtils.sendOtp(user.email, otpNumber);
            this.authUtils.setAuthToken(res, user.id as string, user.roles);
            return {
                message: HttpResponse.OTP_SENT,
                status: StatusCode.CREATED,
                user: toUserDTO(user)
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    };

    public logOut(res: Response): { message: string, status: StatusCode } {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return {
                message: HttpResponse.LOGOUT_SUCCESS,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async refreshToken(token: string, res: Response): Promise<UserReturnType> {
        try {
            if (!token) {
                return {
                    message: HttpResponse.NO_REFRESH_TOKEN,
                    status: StatusCode.UNAUTHORIZED
                }
            }

            const decoded = jwt.verify(token, config.jwt.refreshTokenSecret) as { userId: string };

            const user = await this._userRepo.findByID(decoded.userId);
            if (!user) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.NOT_FOUND
                }
            }

            const { accessToken } = this.authUtils.getTokens(user.id as string, user.roles);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: config.env === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
            return {
                message: HttpResponse.TOKEN_REFRESH,
                status: StatusCode.OK,
                user: toUserDTO(user)
            }
        } catch (error) {
            logger.error(error)
            return {
                message: HttpResponse.INVALID_TOKEN,
                status: StatusCode.FORBIDDEN
            }
        }
    }

    public async googleAuth(firstName: string, lastName: string, email: string, googleId: string, res: Response): Promise<UserReturnType> {
        try {
            if (!lastName) {
                lastName = " "
            }

            let user = await this._userRepo.findByEmail(email);
            if (user) {
                if (!user.googleId) {
                    return {
                        message: HttpResponse.USER_ALREADY_EXISTS,
                        status: StatusCode.FORBIDDEN
                    }
                }

                if (user.isBlocked) {
                    return {
                        message: HttpResponse.ACCOUNT_BLOCKED,
                        status: StatusCode.FORBIDDEN
                    }
                }
                this.authUtils.setAuthToken(res, user?.id as string, user?.roles);
                return {
                    message: HttpResponse.LOGIN_SUCCESSFUL,
                    status: StatusCode.OK,
                    user: toUserDTO(user)
                }
            } else {
                user = await this._userRepo.create({
                    firstName,
                    lastName,
                    email,
                    googleId,
                    authProvider: "google",
                    isVerified: true
                })
                this.authUtils.setAuthToken(res, user?.id as string, user?.roles);
                return {
                    message: HttpResponse.SIGNUP_SUCESS,
                    status: StatusCode.CREATED,
                    user: toUserDTO(user)
                }
            }

        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async forgotPassword(email: string): Promise<UserReturnType> {
        try {
            if (!email || email.trim() === "") {
                return {
                    message: HttpResponse.EMAIL_NOT_FOUND,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const user = await this._userRepo.findByEmail(email, "email");
            if (!user) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.NOT_FOUND
                }
            }

            let request = await this._forgotRepo.findByUserId(user.id as string);
            if (!request) {
                request = await this._forgotRepo.create({ userId: user.id });
                sendResetPasswordMail(user.email, request.requestId);
            }

            return {
                message: HttpResponse.RESET_MAIL_SENT,
                status: StatusCode.CREATED
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async resetPassword(requestId: string, newPassword: string): Promise<UserReturnType> {
        try {
            if (!requestId || requestId.trim() === "") {
                return {
                    message: HttpResponse.REQ_ID_NOT_FOUND,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const request = await this._forgotRepo.findByRequestId(requestId);
            if (!request) {
                return {
                    message: HttpResponse.REQUEST_TIMEOUT,
                    status: StatusCode.NOT_FOUND
                }
            }

            const user = await this._userRepo.findByID(String(request.userId).toString());
            if (!user) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.NOT_FOUND
                }
            }

            await this._forgotRepo.delete(request.id);

            const hashedPassword = await this.authUtils.hashPassword(newPassword);
            await this._userRepo.update(user.id as string, { password: hashedPassword });
            return {
                message: HttpResponse.PASS_CHANGED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getOtpTimer(userId: string): Promise<OtpReturnType> {
        try {
            if (!userId) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const otp = await this._otpRepo.findOtp(userId);
            console.log(otp);
            if (!otp) {
                return {
                    message: HttpResponse.NO_OTP_FOUND,
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
                message: HttpResponse.OTP_FETCHED,
                status: StatusCode.OK,
                timeLeft: timeLeft
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async verifyOtp(userId: string, otp: number, res: Response): Promise<UserReturnType> {
        try {
            if (!userId || !otp) {
                return {
                    message: HttpResponse.INVALID_OTP,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const checkOtp = await this._otpRepo.findOtp(userId, otp);
            if (!checkOtp) {
                return {
                    message: HttpResponse.INVALID_OTP,
                    status: StatusCode.NOT_FOUND
                }
            }
            const user = await this._userRepo.findByID(userId);
            if (!user) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.NOT_FOUND
                }
            }

            await this._userRepo.update(user.id as string, { isVerified: true })
            await this._otpRepo.delete(checkOtp.id)

            const { accessToken, refreshToken } = this.authUtils.getTokens(user?.id as string, user?.roles);
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
            return {
                message: HttpResponse.OTP_VERIFIED,
                status: StatusCode.OK,
                user: toUserDTO({ ...user, isVerified: true })
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async resendOtp(userId: string): Promise<UserReturnType> {
        try {
            if (!userId) {
                return {
                    message: HttpResponse.INVALID_USER_ID,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const user = await this._userRepo.findByID(userId);
            if (!user) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.NOT_FOUND
                }
            }

            const existing = await this._otpRepo.findOtp(userId);
            if (existing) {
                await this._otpRepo.delete(existing.id);
            }
            const otpNumber = this.authUtils.generateOtp();
            await this._otpRepo.create({
                userId: user.id,
                otp: otpNumber
            })

            sendOtpMail(user.email, otpNumber);
            return {
                message: HttpResponse.OTP_SENT,
                status: StatusCode.CREATED
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserReturnType> {
        try {
            if (!userId) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.INVALID_USER_ID
                }
            }

            const user = await this._userRepo.findByID(userId);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: HttpResponse.USER_NOT_FOUND
                }
            }

            if (!currentPassword || currentPassword.trim() === "" || !newPassword || newPassword.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.MISSING_FIELDS
                }
            }

            if (currentPassword == newPassword) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.PASSWORD_CRITERIA_FAILED
                }
            }

            const verify = await this.authUtils.comparePassword(currentPassword, user.password as string);

            if (!verify) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.CURRENT_PASSWORD_NOT_MATCHED
                }
            }

            const hashedPassword = await this.authUtils.hashPassword(newPassword);
            await this._userRepo.update(user.id as string, { password: hashedPassword });
            return {
                status: StatusCode.OK,
                message: HttpResponse.PASS_CHANGED
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}