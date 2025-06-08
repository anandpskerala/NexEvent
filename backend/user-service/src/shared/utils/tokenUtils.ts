import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../../config";

interface JwtPayload {
    userId: string;
    role?: string[];
}

const generateAccessToken = (userId: Types.ObjectId, role: string[]): string => {
    const payload: JwtPayload = {
        userId: userId.toHexString(),
        role
    };

    const options: SignOptions = {
        expiresIn: "15m"
    };

    return jwt.sign(payload, config.jwt.accessTokenSecret, options);
};

const generateRefreshToken = (userId: Types.ObjectId): string => {
    const payload: JwtPayload = {
        userId: userId.toHexString()
    };

    const options: SignOptions = {
        expiresIn: "7d"
    };

    return jwt.sign(payload, config.jwt.refreshTokenSecret, options);
};

export const generateToken = (userId: Types.ObjectId, role: string[]): { accessToken: string, refreshToken: string } => {
    const accessToken = generateAccessToken(userId, role);
    const refreshToken = generateRefreshToken(userId);
    return { accessToken, refreshToken };
};
