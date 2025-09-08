import type { Review } from "../interfaces/entities/Review";
import axiosInstance from "../utils/axiosInstance";

export const postReview = async (id: string, review: Omit<Review, 'id' | 'userId' | 'createdAt'>) => {
    const res = await axiosInstance.post("/user/review", {
        rating: review.rating,
        title: review.title,
        message: review.message,
        eventId: id
    });
    return res.data;
}