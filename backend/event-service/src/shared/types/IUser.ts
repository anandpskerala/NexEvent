import { Types } from "mongoose";

export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string | null;
    googleId: string | null;
    phoneNumber?: number;
    image?: string;
    authProvider: "google" | "email";
    roles: ("user" | "organizer" | "admin")[];
    isBlocked: boolean;
    isVerified: boolean;
    organizer: Types.ObjectId;
}