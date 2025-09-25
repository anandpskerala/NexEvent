import { Types } from "mongoose";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import { AllReviews, IReview } from "../../shared/types/IReview";
import reviewModel from "../../models/reviewModel";
import { BaseRepository } from "../BaseRepository";
import { injectable } from "tsyringe";
import prisma from "../../config/prismaClient";
import { UserDTO } from "../../shared/dtos/userDTO";

@injectable()
export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(reviewModel);
    }

    async addReview(data: IReview): Promise<IReview> {
        const doc = await this.model.create(data);
        return doc.toObject() as IReview;
    }

    async getReview(id: string): Promise<IReview | undefined> {
        if (!Types.ObjectId.isValid(id)) return undefined;

        const doc = await this.model.findById(id);
        if (!doc) return undefined;

        const user = await prisma.user.findUnique({ where: { id: doc.userId } })
            .then(u => u && {
                id: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                image: u.image ?? undefined,
                roles: u.roles,
                authProvider: u.authProvider,
                isBlocked: u.isBlocked,
                isVerified: u.isVerified,
                organizer: u.organizerId,
                createdAt: u.createdAt
            })

        return { ...doc.toObject(), user } as IReview;
    }

    async checkExists(eventId: string, userId: string): Promise<IReview | undefined> {
        const doc = await this.model.findOne({ eventId, userId });
        return doc ? doc.toObject() as IReview : undefined;
    }

    async updateReview(id: string, data: Partial<IReview>): Promise<IReview | undefined> {
        if (!Types.ObjectId.isValid(id)) return undefined;

        const doc = await this.model.findByIdAndUpdate(id, { $set: data }, { new: true });
        return doc ? doc.toObject() as IReview : undefined;
    }

    async deleteReview(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;

        const doc = await this.model.findByIdAndDelete(id);
        return !!doc;
    }

    async getReviews(eventId: string, offset: number, limit: number = 20): Promise<AllReviews> {
        if (!Types.ObjectId.isValid(eventId)) return { reviews: [], total: 0, averageRating: 0 };

        const [reviews, total, ratingStats] = await Promise.all([
            this.model.find({ eventId }).sort({ createdAt: -1 }).skip(offset).limit(limit),
            this.model.countDocuments({ eventId }),
            this.model.aggregate([
                { $match: { eventId: new Types.ObjectId(eventId) } },
                {
                    $group: {
                        _id: null,
                        totalScore: { $sum: "$rating" },
                        totalReviews: { $sum: 1 },
                        averageRating: { $avg: "$rating" },
                    },
                },
            ]),
        ]);

        const userIds = reviews.map(r => r.userId).filter(Boolean) as string[];
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, firstName: true, lastName: true, email: true, image: true, authProvider: true, isBlocked: true, isVerified: true, roles: true, organizer: true, createdAt: true },
        });
        const userMap = new Map(users.map(u => [u.id, u]));

        const reviewWithUsers = reviews.map(r => {
            const prismaUser = userMap.get(r.userId);

            let userDTO: UserDTO | undefined = undefined;

            if (prismaUser) {
                userDTO = {
                    id: prismaUser.id,
                    firstName: prismaUser.firstName,
                    lastName: prismaUser.lastName,
                    email: prismaUser.email,
                    image: prismaUser.image ?? undefined, // matches DTO optional
                    authProvider: prismaUser.authProvider,
                    roles: prismaUser.roles,
                    isBlocked: prismaUser.isBlocked,
                    isVerified: prismaUser.isVerified,
                    organizer: prismaUser.organizer
                        ? {
                            ...prismaUser.organizer,
                            website: prismaUser.organizer.website ?? "",
                        }
                        : null,
                    createdAt: prismaUser.createdAt,
                };
            }

            return {
                ...r.toObject(),
                user: userDTO,
            };
        });


        const averageRating = ratingStats.length ? ratingStats[0].averageRating : 0;

        return {
            reviews: reviewWithUsers,
            total,
            averageRating,
        };
    }
}
