import { Types } from "mongoose";

export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: number;
    image?: string;
    organizer: Types.ObjectId;
}