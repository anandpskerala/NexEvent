import { ReviewRepository } from "../../repositories/implementation/ReviewRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { IReview } from "../../shared/types/IReview";
import { ReviewPaginationType, ReviewType } from "../../shared/types/ReturnTypes";
import logger from "../../shared/utils/logger";
import { IReviewService } from "../interfaces/IReviewService";

export class ReviewService implements IReviewService {
    constructor(private reviewRepo: ReviewRepository) { }

    public async createReview(data: IReview): Promise<ReviewType> {
        try {
            const exists = await this.reviewRepo.checkExists(data.eventId, data.userId.toString());
            if (exists) {
                return {
                    message: HttpResponse.ALREADY_RATED,
                    status: StatusCode.BAD_REQUEST
                }
            }

            await this.reviewRepo.addReview(data);
            return {
                message: HttpResponse.REVIEW_POSTED,
                status: StatusCode.CREATED
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getReviews(eventId: string, page: number, limit: number): Promise<ReviewPaginationType> {
        try {
            const offset = (page - 1) * limit;
            const res = await this.reviewRepo.getReviews(eventId, offset, limit);
            return {
                message: HttpResponse.REVIEW_FETCHED,
                status: StatusCode.OK,
                total: res.total,
                reviews: res.reviews,
                avgRating: res.averageRating,
                page,
                pages: Math.ceil(res.total / limit)
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}