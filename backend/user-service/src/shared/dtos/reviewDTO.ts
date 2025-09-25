import { IReview } from "../types/IReview";
import { UserDTO } from "./userDTO";

export interface ReviewDTO {
    id: string;
    userId: string;
    user: UserDTO;
    eventId: string;
    rating: number;
    title: string;
    message: string;
    createdAt: string;
}

export const toReviewDTO = (entity: IReview): ReviewDTO => {
    return {
        id: entity.id as string,
        userId: entity.userId,
        user: entity.user as UserDTO,
        eventId: entity.eventId,
        rating: entity.rating,
        title: entity.title,
        message: entity.message,
        createdAt: entity.createdAt as string,
    }
}