import { IBookingRepository } from "../../repositories/interfaces/IBookingRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { AnalyticsReturnType, AnalyticsTopSellingType } from "../../shared/types/returnTypes";
import { GroupBy } from "../../shared/types/RevenueAnalytics";
import logger from "../../shared/utils/logger";
import { IAnalyticService } from "../interfaces/IAnalyticService";

export class AnalyticService implements IAnalyticService {
    constructor(private repo: IBookingRepository) {

    }

    public async getBookingAnalytics(groupBy: GroupBy, organizerId?: string): Promise<AnalyticsReturnType> {
        try {
            const data = await this.repo.getRevenueAnalytics(groupBy, organizerId);
            return {
                message: HttpResponse.ANALYTIC_FETCHED,
                status: StatusCode.OK,
                analytics: data
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getTopAnalytics(groupBy: GroupBy, organizerId?: string, limit: number = 10): Promise<AnalyticsTopSellingType> {
        try {
            const data = await this.repo.getTopBookings(groupBy, limit, organizerId);
            return {
                message: HttpResponse.ANALYTIC_FETCHED,
                status: StatusCode.OK,
                analytics: data
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