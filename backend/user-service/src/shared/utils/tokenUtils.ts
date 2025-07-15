import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config";

interface JwtPayload {
    userId: string;
    role?: string[];
}

const generateAccessToken = (userId: string, role: string[]): string => {
    const payload: JwtPayload = {
        userId: userId,
        role
    };

    const options: SignOptions = {
        expiresIn: "15m"
    };

    return jwt.sign(payload, config.jwt.accessTokenSecret, options);
};

const generateRefreshToken = (userId: string): string => {
    const payload: JwtPayload = {
        userId: userId
    };

    const options: SignOptions = {
        expiresIn: "7d"
    };

    return jwt.sign(payload, config.jwt.refreshTokenSecret, options);
};

export const generateToken = (userId: string, role: string[]): { accessToken: string, refreshToken: string } => {
    const accessToken = generateAccessToken(userId, role);
    const refreshToken = generateRefreshToken(userId);
    return { accessToken, refreshToken };
};
