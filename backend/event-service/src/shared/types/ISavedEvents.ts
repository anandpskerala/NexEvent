import { Types } from "mongoose";

export interface ISavedEvents {
    id?: string;
    eventId: Types.ObjectId;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
}