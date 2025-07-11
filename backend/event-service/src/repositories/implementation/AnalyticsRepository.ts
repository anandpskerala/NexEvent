import mongoose, { Model, PipelineStage, Types } from "mongoose";
import { IAnalyticsRepository } from "../interfaces/IAnalyticsRepository";
import { IBooking } from "../../shared/types/IBooking";
import bookingModel from "../../models/bookingModel";
import { GroupBy, RevenueAnalyticsGraphPoint, RevenueAnalyticsResultRaw, TopSelling } from "../../shared/types/RevenueAnalytics";

export class AnalyticsRepository implements IAnalyticsRepository {
    private model: Model<IBooking>;

    constructor() {
        this.model = bookingModel;
    }

    async getRevenueAnalytics(groupBy: GroupBy, organizerId?: string): Promise<RevenueAnalyticsGraphPoint[]> {
        const now = new Date();

        let start: Date;
        let dateFormat: string;

        switch (groupBy) {
            case "today":
                start = new Date();
                start.setHours(0, 0, 0, 0);
                dateFormat = "%H:%M";
                break;
            case "week":
            case "month":
                start = new Date();
                start.setDate(now.getDate() - (groupBy === "week" ? 6 : now.getDate() - 1));
                dateFormat = "%Y-%m-%d";
                break;
            case "year":
                start = new Date(now.getFullYear(), 0, 1);
                dateFormat = "%Y-%m";
                break;
            default:
                throw new Error("Invalid groupBy");
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    status: "paid",
                    createdAt: { $gte: start, $lte: now }
                }
            },
            {
                $lookup: {
                    from: "events",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "event"
                }
            },
            { $unwind: "$event" }
        ];

        if (organizerId) {
            pipeline.push({
                $match: {
                    "event.userId": new Types.ObjectId(organizerId)
                }
            });
        }

        pipeline.push(
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: dateFormat,
                            date: "$createdAt"
                        }
                    },
                    totalRevenue: { $sum: "$totalAmount" },
                    totalBookings: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        );

        const rawResult = await this.model.aggregate<RevenueAnalyticsResultRaw>(pipeline);

        return rawResult.map(item => ({
            date: item._id,
            revenue: item.totalRevenue,
            bookings: item.totalBookings
        }));
    }

    async getTopBookings(groupBy: GroupBy, limit: number = 10, organizerId?: string): Promise<TopSelling[]> {
        const now = new Date();
        let start: Date;

        switch (groupBy) {
            case "today":
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case "month":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "year":
                start = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                throw new Error("Invalid groupBy filter");
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    status: "paid",
                    createdAt: { $gte: start, $lte: now }
                }
            },
            {
                $group: {
                    _id: "$eventId",
                    totalRevenue: { $sum: "$totalAmount" },
                    totalBookings: { $sum: 1 },
                    totalTickets: {
                        $sum: { $sum: "$tickets.quantity" }
                    }
                }
            },
            {
                $lookup: {
                    from: "events",
                    localField: "_id",
                    foreignField: "_id",
                    as: "event"
                }
            },
            { $unwind: "$event" }
        ];

        if (organizerId) {
            pipeline.push({
                $match: {
                    "event.userId": new mongoose.Types.ObjectId(organizerId)
                }
            });
        }

        pipeline.push(
            {
                $project: {
                    _id: 0,
                    eventId: "$event._id",
                    title: "$event.title",
                    image: "$event.image",
                    totalRevenue: 1,
                    totalBookings: 1,
                    totalTickets: 1
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: limit }
        );

        return await this.model.aggregate(pipeline);
    }

    async countBooking(userId: string, eventId: string): Promise<number> {
        const doc = await this.model.countDocuments({userId, eventId});
        return doc;
    }
}