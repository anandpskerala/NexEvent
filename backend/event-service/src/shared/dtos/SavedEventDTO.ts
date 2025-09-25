import { Types } from "mongoose";
import { ISavedEvents } from "../types/ISavedEvents";

export interface SavedEventDTO {
    id: string;
    eventId: Types.ObjectId;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export const toSavedDTO = (entity: ISavedEvents): SavedEventDTO => {
    return {
        id: entity.id as string,
        eventId: entity.eventId,
        userId: entity.userId,
        createdAt: entity.createdAt as string,
        updatedAt: entity.updatedAt as string
    }
}