import { Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "./tokenUtils";
import { Types } from "mongoose";
import { config } from "../../config";
import { sendOtpMail } from "./mailer";

export class AuthUtils {
    public comparePassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }

    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(password, salt);
        return hashed;
    }

    public getTokens(userId: string, roles: string[]): { accessToken: string, refreshToken: string } {
        return generateToken(new Types.ObjectId(userId), roles);
    }

    public sendOtp(email: string, otp: number): void {
        sendOtpMail(email, otp);
    }

    public setAuthToken(res: Response, userId: string, roles: string[]): void {
        const { accessToken, refreshToken } = this.getTokens(userId, roles);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.env === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.env === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }

    public generateOtp(): number {
        return crypto.randomInt(100000, 999999);
    }
}