import { Types } from "mongoose";

export interface IReview {
    id?: string;
    userId: Types.ObjectId;
    eventId: string;
    rating: number;
    title: string;
    message: string;
}

export interface AllReviews {
    reviews: IReview[],
    total: number,
    averageRating: number,
}