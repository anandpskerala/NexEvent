export type GroupBy = "day" | "month" | "year";

export interface RevenueAnalyticsResultRaw {
  _id: string;
  totalRevenue: number;
  totalBookings: number;
}

export interface RevenueAnalyticsGraphPoint {
  date: string;
  revenue: number;
  bookings: number;
}