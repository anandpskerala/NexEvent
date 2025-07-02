import { IReview } from "../../shared/types/IReview";
import { ReviewType, ReviewPaginationType } from "../../shared/types/ReturnTypes";

export interface IReviewService {
    createReview(data: IReview): Promise<ReviewType>;
    getReviews(eventId: string, page: number, limit: number): Promise<ReviewPaginationType>;
}