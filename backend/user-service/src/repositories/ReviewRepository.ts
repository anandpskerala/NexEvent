import { Model, Types } from "mongoose";
import { IReviewRepository } from "./interfaces/IReviewRepository";
import { AllReviews, IReview } from "../shared/types/IReview";
import reviewModel from "../models/reviewModel";

export class ReviewRepository implements IReviewRepository {
    private model: Model<IReview>;

    constructor() {
        this.model = reviewModel;
    }

    async addReview(data: IReview): Promise<IReview> {
        const doc = await this.model.create(data);
        return doc.toJSON();
    }

    async getReview(id: string): Promise<IReview | undefined> {
        const doc = await this.model.findOne({ _id: id }).populate("userId");
        return doc?.toJSON();
    }

    async checkExists(eventId: string, userId: string): Promise<IReview | undefined> {
        const doc = await this.model.findOne({eventId, userId});
        return doc?.toJSON();
    }

    async updateReview(id: string, data: Partial<IReview>): Promise<IReview | undefined> {
        const doc = await this.model.findByIdAndUpdate(id, { $set: data }, { new: true });
        return doc?.toJSON();
    }

    async deleteReview(id: string): Promise<boolean> {
        const doc = await this.model.findByIdAndDelete(id);
        return !!doc;
    }

    async getReviews(eventId: string, offset: number, limit: number = 20): Promise<AllReviews> {
        const [items, total, ratingStats] = await Promise.all([
            this.model.find({ eventId }).sort({ createdAt: -1 }).skip(offset).limit(limit).populate("userId"),
            this.model.countDocuments({ eventId }),
            this.model.aggregate([
                { $match: { eventId: new Types.ObjectId(eventId) } },
                {
                    $group: {
                        _id: null,
                        totalScore: { $sum: "$rating" },
                        totalReviews: { $sum: 1 },
                        averageRating: { $avg: "$rating" }
                    }
                }
            ])
        ]);
        const docs = items.map(doc => doc.toJSON());

        console.log(ratingStats)
        const averageRating = ratingStats.length !== 0 ? ratingStats[0].averageRating : 0;
        return {
            reviews: docs,
            total,
            averageRating
        }
    }
}