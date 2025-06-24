import { Request, Response } from "express";
import { ReviewService } from "../services/reviewService";
import { Types } from "mongoose";

export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    public addReview = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { eventId , rating, title, message} = req.body;
        const result = await this.reviewService.createReview({userId: new Types.ObjectId(userId), eventId, rating, title, message});
        res.status(result.status).json({message: result.message});
    }

    public getReviews = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const result = await this.reviewService.getReviews(id, Number(page), Number(limit));
        res.status(result.status).json({message: result.message, reviews: result.reviews, avgRating: result.avgRating, page: result.page, pages: result.pages, total: result.total})
    }
}