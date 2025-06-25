import { AllReviews, IReview } from "../../shared/types/IReview";

export interface IReviewRepository {
    addReview(data: IReview): Promise<IReview>;
    getReview(id: string): Promise<IReview | undefined>;
    updateReview(id: string, data: Partial<IReview>): Promise<IReview | undefined>;
    deleteReview(id: string): Promise<boolean>;
    getReviews(eventId: string, offset: number, limit: number): Promise<AllReviews>;
    checkExists(eventId: string, userId: string): Promise<IReview | undefined>;
}