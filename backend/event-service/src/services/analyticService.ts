import { BookingRepository } from "../repositories/BookingRepository";
import { StatusCode } from "../shared/constants/statusCode";
import { GroupBy } from "../shared/types/RevenueAnalytics";

export class AnalyticService {
    constructor(private repo: BookingRepository) {

    }

    public async getBookingAnalytics(groupBy: GroupBy, organizerId?: string) {
        try {
            const data = await this.repo.getRevenueAnalytics(groupBy, organizerId);
            return {
                message: "Fetched analytics",
                status: StatusCode.OK,
                analytics: data
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getTopAnalytics(groupBy: GroupBy, organizerId?: string, limit: number = 10) {
        try {
            const data = await this.repo.getTopBookings(groupBy, limit, organizerId);
            return {
                message: "Fetched analytics",
                status: StatusCode.OK,
                analytics: data
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