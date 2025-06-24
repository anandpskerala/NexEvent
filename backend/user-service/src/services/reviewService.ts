import { ReviewRepository } from "../repositories/ReviewRepository";
import { StatusCode } from "../shared/constants/statusCode";
import { IReview } from "../shared/types/IReview";

export class ReviewService {
    constructor(private reviewRepo: ReviewRepository) { }

    public async createReview(data: IReview) {
        try {
            const exists = await this.reviewRepo.checkExists(data.eventId, data.userId.toString());
            if (exists) {
                return {
                    message: "You have already rated this event",
                    status: StatusCode.BAD_REQUEST
                }
            }

            await this.reviewRepo.addReview(data);
            return {
                message: "Review posted",
                status: StatusCode.CREATED
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getReviews(eventId: string, page: number, limit: number) {
        try {
            const offset = (page - 1) * limit;
            const res = await this.reviewRepo.getReviews(eventId, offset, limit);
            return {
                message: "Fetched reviews",
                status: StatusCode.OK,
                total: res.total,
                reviews: res.reviews,
                avgRating: res.averageRating,
                page,
                pages: Math.ceil(res.total / limit)
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}