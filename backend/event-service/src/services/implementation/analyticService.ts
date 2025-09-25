import { inject, injectable } from "tsyringe";
import { IAnalyticsRepository } from "../../repositories/interfaces/IAnalyticsRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { AnalyticsReturnType, AnalyticsTopSellingType } from "../../shared/types/ReturnType";
import { GroupBy } from "../../shared/types/RevenueAnalytics";
import { IAnalyticService } from "../interfaces/IAnalyticService";

@injectable()
export class AnalyticService implements IAnalyticService {
    constructor(@inject("IAnalyticsRepository") private _repo: IAnalyticsRepository) {

    }

    public async getBookingAnalytics(groupBy: GroupBy, organizerId?: string): Promise<AnalyticsReturnType> {
        const data = await this._repo.getRevenueAnalytics(groupBy, organizerId);
        return {
            message: HttpResponse.ANALYTIC_FETCHED,
            status: StatusCode.OK,
            analytics: data
        }
    }

    public async getTopAnalytics(groupBy: GroupBy, organizerId?: string, limit: number = 10): Promise<AnalyticsTopSellingType> {
        const data = await this._repo.getTopBookings(groupBy, limit, organizerId);
        return {
            message: HttpResponse.ANALYTIC_FETCHED,
            status: StatusCode.OK,
            analytics: data
        }
    }
}