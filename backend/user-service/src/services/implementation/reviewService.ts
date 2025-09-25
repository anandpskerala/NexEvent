import { inject, injectable } from "tsyringe";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { IReview } from "../../shared/types/IReview";
import { ReviewPaginationType, ReviewType } from "../../shared/types/ReturnType";
import { IReviewService } from "../interfaces/IReviewService";
import { IReviewRepository } from "../../repositories/interfaces/IReviewRepository";
import { toReviewDTO } from "../../shared/dtos/reviewDTO";

@injectable()
export class ReviewService implements IReviewService {
    constructor(@inject("IReviewRepository") private _reviewRepo: IReviewRepository) { }

    public async createReview(data: IReview): Promise<ReviewType> {
        const exists = await this._reviewRepo.checkExists(data.eventId, data.userId.toString());
        if (exists) {
            return {
                message: HttpResponse.ALREADY_RATED,
                status: StatusCode.BAD_REQUEST
            }
        }

        await this._reviewRepo.addReview(data);
        return {
            message: HttpResponse.REVIEW_POSTED,
            status: StatusCode.CREATED
        }
    }

    public async getReviews(eventId: string, page: number, limit: number): Promise<ReviewPaginationType> {
        const offset = (page - 1) * limit;
        const res = await this._reviewRepo.getReviews(eventId, offset, limit);
        return {
            message: HttpResponse.REVIEW_FETCHED,
            status: StatusCode.OK,
            total: res.total,
            reviews: res.reviews.map(item => toReviewDTO(item)),
            avgRating: res.averageRating,
            page,
            pages: Math.ceil(res.total / limit)
        }
    }
}