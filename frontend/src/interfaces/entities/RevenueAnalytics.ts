export interface RevenueAnalyticsGraphPoint {
  date: string;
  revenue: number;
  bookings: number;
}

export interface TopSelling {
  eventId: string;
  title: string;
  image: string;
  totalRevenue: number;
  totalBookings: number;
  totalTickets: number;
}