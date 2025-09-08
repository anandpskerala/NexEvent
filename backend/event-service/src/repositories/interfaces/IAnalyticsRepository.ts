import { GroupBy, RevenueAnalyticsGraphPoint, TopSelling } from "../../shared/types/RevenueAnalytics";

export interface IAnalyticsRepository {
    getRevenueAnalytics(groupBy: GroupBy, organizerId?: string): Promise<RevenueAnalyticsGraphPoint[]>;
    getTopBookings(groupBy: GroupBy, limit: number, organizerId?: string): Promise<TopSelling[]>
    countBooking(userId: string, eventId: string): Promise<number>;
}