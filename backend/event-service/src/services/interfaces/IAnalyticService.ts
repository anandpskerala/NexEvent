import { AnalyticsReturnType, AnalyticsTopSellingType } from "../../shared/types/ReturnType";
import { GroupBy } from "../../shared/types/RevenueAnalytics";

export interface IAnalyticService {
    getBookingAnalytics(groupBy: GroupBy, organizerId?: string): Promise<AnalyticsReturnType>;
    getTopAnalytics(groupBy: GroupBy, organizerId?: string, limit?: number): Promise<AnalyticsTopSellingType>;
}