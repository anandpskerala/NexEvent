import { UserDTO } from "../dtos/userDTO";

export interface IReview {
    id?: string;
    userId: string;
    user?: UserDTO;
    eventId: string;
    rating: number;
    title: string;
    message: string;
    createdAt?: string;
}

export interface AllReviews {
    reviews: IReview[],
    total: number,
    averageRating: number,
}